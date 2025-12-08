// Prisma Client Singleton with MySQL/MariaDB Adapter (Prisma v7)
// This ensures we only create one instance of PrismaClient
// Supports both MySQL (via adapter) and Postgres (via DATABASE_URL)
// Optimized for serverless environments (Vercel, etc.)

// Import env helper to ensure DATABASE_URL is set
import './env.js';
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

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
      connectionLimit: 5, // Reduced for Railway
      connectTimeout: 30000, // 30 seconds to establish connection
      acquireTimeout: 30000, // 30 seconds to acquire connection from pool
      timeout: 30000, // 30 seconds query timeout
      waitForConnections: true, // Wait for available connection
      queueLimit: 0, // Unlimited queue
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    };
    
    // Add SSL for Railway (if host contains railway or rlwy)
    if (adapterConfig.host.includes('railway') || adapterConfig.host.includes('rlwy')) {
      adapterConfig.ssl = {
        rejectUnauthorized: false // Railway uses self-signed certificates
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
