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
    // Use MySQL/MariaDB - try to use adapter if available
    // Since we can't use top-level await in conditionals, we'll initialize lazily
    // For now, create PrismaClient with DATABASE_URL (it will work without adapter)
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
    
    // Try to initialize adapter asynchronously (non-blocking)
    // This is optional - Prisma will work with DATABASE_URL without adapter
    import('@prisma/adapter-mariadb').then(adapterModule => {
      try {
        const PrismaMariaDb = adapterModule.default || adapterModule.PrismaMariaDb || adapterModule;
        
        const adapter = new PrismaMariaDb({
          host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
          user: process.env.DB_USER || process.env.DATABASE_USER || 'root',
          password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '',
          database: process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard',
          port: Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306),
          connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 3),
        });
        
        // Create new PrismaClient with adapter
        const newPrisma = new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        });
        
        // Replace the old instance
        prisma.$disconnect().catch(() => {});
        prisma = newPrisma;
        globalForPrisma.prisma = newPrisma;
      } catch (err) {
        // If adapter setup fails, continue with default connection
        console.warn('MariaDB adapter initialization failed, using default connection:', err.message);
      }
    }).catch(() => {
      // Adapter not available - that's okay, Prisma works with DATABASE_URL
    });
  }
  
  // Cache globally for serverless reuse
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
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
