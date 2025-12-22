// Prisma Client Singleton with MySQL/MariaDB Adapter (Prisma v7)
// NOTE: This file is deprecated and kept for backward compatibility only
// Please use src/config/database.js instead

import 'dotenv/config';
import '../src/config/database.js'; // Ensure DATABASE_URL is set

// Prisma Client is CommonJS, so we need to import it as default and destructure
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Check if using Postgres (Vercel Postgres) or MySQL
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://');

// Use globalThis for better serverless compatibility
const globalForPrisma = globalThis;

// Pre-import adapter module (top-level await) - always import, use conditionally
const adapterModule = await import('@prisma/adapter-mariadb');

let prisma;

if (globalForPrisma.prisma) {
  // Reuse existing instance (important for serverless)
  prisma = globalForPrisma.prisma;
} else {
  if (isPostgres) {
    // Use Postgres (Vercel Postgres) - no adapter needed
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  } else {
    // Use MySQL/MariaDB with adapter (required for Prisma v7)
    const PrismaMariaDb = adapterModule.default || adapterModule.PrismaMariaDb || adapterModule;
    
    const adapterConfig = {
      host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
      user: process.env.DB_USER || process.env.DATABASE_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '',
      database: process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard',
      port: Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306),
      // Pool configuration (valid for mysql2 pool)
      connectionLimit: 5,
      waitForConnections: true,
      queueLimit: 0,
      // Connection configuration (valid for mysql2 connection)
      connectTimeout: 30000, // 30 seconds to establish connection
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      // Note: acquireTimeout and timeout are pool-only options, not connection options
      // These will be handled by the adapter's pool configuration
    };
    
    // Add SSL for remote databases (DigitalOcean, etc.)
    if (adapterConfig.host.includes('ondigitalocean.com')) {
      adapterConfig.ssl = {
        rejectUnauthorized: false
      };
    }
    
    const adapter = new PrismaMariaDb(adapterConfig);
    
    // Create PrismaClient with adapter (required for MySQL in Prisma v7)
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
