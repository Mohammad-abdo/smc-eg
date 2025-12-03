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
    // Use MySQL/MariaDB with adapter
    // Use top-level await for proper initialization
    const adapterModule = await import('@prisma/adapter-mariadb');
    const PrismaMariaDb = adapterModule.default || adapterModule.PrismaMariaDb || adapterModule;
    
    // Build adapter with serverless-optimized connection pool settings
    const adapter = new PrismaMariaDb({
      host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
      user: process.env.DB_USER || process.env.DATABASE_USER || 'root',
      password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '',
      database: process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard',
      port: Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306),
      // Serverless-optimized settings: smaller pool, longer timeouts
      connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 3), // Smaller pool for serverless
    });

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
    await prisma.$disconnect().catch(() => {});
  });
  
  process.on('SIGINT', async () => {
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await prisma.$disconnect().catch(() => {});
    process.exit(0);
  });
}

export default prisma;
