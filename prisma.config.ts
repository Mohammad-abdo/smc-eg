// Prisma v7 Configuration
// This file configures Prisma to use DATABASE_URL from environment variables

require('dotenv').config();
const { defineConfig, env } = require('prisma/config');

// Ensure DATABASE_URL is set (build from separate vars if needed)
const { getDatabaseUrl } = require('./lib/env');
getDatabaseUrl();

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
