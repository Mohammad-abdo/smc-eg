// Prisma Client Singleton with MySQL/MariaDB Adapter (Prisma v7)
// This ensures we only create one instance of PrismaClient
// Supports both MySQL (via adapter) and Postgres (via DATABASE_URL)

// Import env helper to ensure DATABASE_URL is set
import './env.js';
import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

// Check if using Postgres (Vercel Postgres) or MySQL
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgres = databaseUrl.includes('postgresql://') || databaseUrl.includes('postgres://');

let prisma;

if (isPostgres) {
  // Use Postgres (Vercel Postgres) - no adapter needed
  prisma = global.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
} else {
  // Use MySQL/MariaDB with adapter
  // Dynamic import for adapter (must be async)
  const adapterModule = await import('@prisma/adapter-mariadb');
  const { PrismaMariaDb } = adapterModule.default || adapterModule;
  
  // Build adapter from environment variables
  const adapter = new PrismaMariaDb({
    host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
    user: process.env.DB_USER || process.env.DATABASE_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '',
    database: process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard',
    port: Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306),
    connectionLimit: 10,
  });

  // Create PrismaClient with adapter
  prisma = global.prisma || new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

// Cache in development to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
