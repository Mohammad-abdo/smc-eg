#!/usr/bin/env node
// Database setup script for production deployments
// This script safely runs migrations and optionally seeds the database
// Suitable for use in Coolify, Docker, or any deployment environment

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const backendPath = join(__dirname, '..');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function setupDatabase() {
  const startTime = Date.now();
  
  try {
    log('\n🚀 Setting up database...\n', 'bright');

    // Check if DATABASE_URL or database connection vars are set
    const hasDatabaseUrl = process.env.DATABASE_URL || 
                          (process.env.DB_HOST && process.env.DB_NAME);
    
    if (!hasDatabaseUrl) {
      log('⚠️  Database connection not configured.', 'yellow');
      log('   Please set DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_NAME', 'yellow');
      log('   Skipping database setup.\n', 'yellow');
      process.exit(0); // Exit gracefully - not an error
    }

    // Step 1: Generate Prisma Client
    log('1️⃣  Generating Prisma Client...', 'blue');
    try {
      execSync('npx prisma generate', {
        stdio: 'inherit',
        cwd: backendPath,
        env: { ...process.env },
      });
      log('✅ Prisma Client generated\n', 'green');
    } catch (error) {
      log('❌ Failed to generate Prisma Client', 'red');
      log(`   Error: ${error.message}`, 'red');
      process.exit(1);
    }

    // Step 2: Run Migrations (production-safe)
    log('2️⃣  Running database migrations...', 'blue');
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        cwd: backendPath,
        env: { ...process.env },
      });
      log('✅ Migrations completed successfully\n', 'green');
    } catch (error) {
      log('❌ Migration failed', 'red');
      log(`   Error: ${error.message}`, 'red');
      log('\n💡 Troubleshooting tips:', 'yellow');
      log('   - Check that database is accessible', 'yellow');
      log('   - Verify DATABASE_URL or connection variables', 'yellow');
      log('   - Ensure database user has proper permissions\n', 'yellow');
      process.exit(1);
    }

    // Step 3: Run Seed (optional, controlled by env var)
    const shouldSeed = process.env.RUN_SEED === 'true' || 
                      process.env.RUN_SEED === '1' ||
                      process.argv.includes('--seed');
    
    if (shouldSeed) {
      log('3️⃣  Seeding database...', 'blue');
      try {
        execSync('npm run seed', {
          stdio: 'inherit',
          cwd: backendPath,
          env: { ...process.env },
        });
        log('✅ Database seeded successfully\n', 'green');
      } catch (error) {
        log('⚠️  Seeding failed (this is optional)', 'yellow');
        log(`   Error: ${error.message}\n`, 'yellow');
        // Don't exit - seeding is optional
      }
    } else {
      log('3️⃣  Skipping seed', 'yellow');
      log('   (Set RUN_SEED=true or use --seed flag to enable)\n', 'yellow');
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    log(`✅ Database setup completed in ${duration}s\n`, 'green');

  } catch (error) {
    log(`\n❌ Database setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

setupDatabase();

