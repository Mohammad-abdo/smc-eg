// Database configuration and connection setup
// Handles DATABASE_URL construction and Prisma Client initialization
import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Build DATABASE_URL from environment variables
function buildDatabaseUrl() {
  // If DATABASE_URL is already set, validate and use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    let dbUrl = process.env.DATABASE_URL.trim();
    
    // Validate DATABASE_URL format
    try {
      const hasDoubleColon = dbUrl.match(/mysql:\/\/[^@]+:.*:.*@/);
      const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
      const hasInvalidPort = !/mysql:\/\/[^@]+@[^:]+:\d+/.test(dbUrl);
      
      // If URL has issues, rebuild from separate variables
      if (hasDoubleColon || hasInvalidPort || !urlMatch) {
        console.warn('⚠️  Invalid DATABASE_URL format detected. Rebuilding from DB_* variables...');
      } else {
        // URL seems valid, check for SSL
        const hasSSL = dbUrl.includes('ssl') || dbUrl.includes('ssl-mode');
        
        // Add SSL params for remote databases if missing
        if (!hasSSL && dbUrl.includes('ondigitalocean.com')) {
          const separator = dbUrl.includes('?') ? '&' : '?';
          dbUrl = `${dbUrl}${separator}ssl={"rejectUnauthorized":false}&connect_timeout=60&acquire_timeout=60`;
        }
        
        process.env.DATABASE_URL = dbUrl;
        return dbUrl;
      }
    } catch (error) {
      console.warn('⚠️  Error validating DATABASE_URL. Rebuilding from DB_* variables...', error.message);
    }
  }

  // Build DATABASE_URL from separate variables
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smc-backend';
  const port = process.env.DB_PORT || '3306';

  // Encode password for URL (handle special characters)
  const encodedPassword = encodeURIComponent(password);

  // Build MySQL connection URL
  let url = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}`;
  
  // Add SSL and timeout parameters for remote databases
  const isRemote = host.includes('ondigitalocean.com') ||
                   (!host.includes('localhost') && !host.includes('127.0.0.1'));
  
  if (isRemote) {
    url += '?ssl={"rejectUnauthorized":false}&connect_timeout=60&acquire_timeout=60';
  }
  
  // Set it for Prisma to use
  process.env.DATABASE_URL = url;
  
  return url;
}

// Initialize DATABASE_URL
buildDatabaseUrl();

// Check if using Postgres or MySQL
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://');

// Use globalThis for serverless compatibility
const globalForPrisma = globalThis;

// Pre-import adapter module
const adapterModule = await import('@prisma/adapter-mariadb');

let prisma;

if (globalForPrisma.prisma) {
  // Reuse existing instance (important for serverless)
  prisma = globalForPrisma.prisma;
} else {
  if (isPostgres) {
    // Use Postgres - no adapter needed
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } else {
    // Use MySQL/MariaDB with adapter (required for Prisma v7)
    const PrismaMariaDb = adapterModule.default || adapterModule.PrismaMariaDb || adapterModule;
    
    const adapterConfig = {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smc_dashboard', // Fixed: match seed.js default
      port: Number(process.env.DB_PORT || 3306),
      // Pool configuration - increased for better stability
      connectionLimit: 10, // Increased from 5 to handle more concurrent requests
      waitForConnections: true,
      queueLimit: 0,
      // Connection timeout - increased for slow connections
      connectTimeout: 30000, // 30 seconds to establish connection
      // Keep connections alive to prevent timeouts
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };
    
    // Add SSL for remote databases (DigitalOcean)
    if (adapterConfig.host.includes('ondigitalocean.com')) {
      adapterConfig.ssl = {
        rejectUnauthorized: false
      };
    }
    
    const adapter = new PrismaMariaDb(adapterConfig);
    
    // Create PrismaClient with adapter
    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }
  
  // Cache globally for serverless reuse
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    const prismaInstance = globalForPrisma.prisma || prisma;
    await prismaInstance.$disconnect().catch(() => {});
  });
  
  process.on('SIGINT', async () => {
    const prismaInstance = globalForPrisma.prisma || prisma;
    await prismaInstance.$disconnect().catch(() => {});
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    const prismaInstance = globalForPrisma.prisma || prisma;
    await prismaInstance.$disconnect().catch(() => {});
    process.exit(0);
  });
}

export default prisma;
export { buildDatabaseUrl };

