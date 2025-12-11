// Prisma v7 Configuration
// This file configures Prisma to use DATABASE_URL from environment variables

require('dotenv').config();
const { defineConfig, env } = require('prisma/config');

// Ensure DATABASE_URL is set (build from separate vars if needed)
// This MUST run BEFORE Prisma tries to read DATABASE_URL
// Using CommonJS version for compatibility
const { getDatabaseUrl } = require('./lib/env.cjs');

// Build DATABASE_URL if it's invalid or missing
// This will automatically fix invalid DATABASE_URL or build from DB_* variables
getDatabaseUrl();

// Log the final DATABASE_URL (without password) for debugging
const dbUrl = process.env.DATABASE_URL || '';
if (dbUrl) {
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
  console.log('📊 Using DATABASE_URL:', maskedUrl);
}

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
