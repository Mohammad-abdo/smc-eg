#!/usr/bin/env node
// Post-install script for automatic migration and seeding
// This runs after npm install to set up the database

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

async function runPostInstall() {
  try {
    log('\n🚀 Running post-install setup...\n', 'bright');

    // Step 1: Generate Prisma Client
    log('1️⃣  Generating Prisma Client...', 'blue');
    try {
      execSync('npx prisma generate', {
        stdio: 'inherit',
        cwd: backendPath,
        env: process.env,
      });
      log('✅ Prisma Client generated\n', 'green');
    } catch (error) {
      log('⚠️  Prisma Client generation failed (this is okay if dependencies are missing)\n', 'yellow');
      // Don't exit - this might be called before all dependencies are installed
      return;
    }

    // Step 2: Run Migrations
    log('2️⃣  Running database migrations...', 'blue');
    try {
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        cwd: backendPath,
        env: process.env,
      });
      log('✅ Migrations completed successfully\n', 'green');
    } catch (error) {
      log('⚠️  Migration failed. This might be expected if:', 'yellow');
      log('   - Database is not yet available', 'yellow');
      log('   - Environment variables are not set', 'yellow');
      log('   - You are in development mode\n', 'yellow');
      log('   You can run migrations manually later with: npm run prisma:migrate:deploy\n', 'yellow');
      // Don't exit - migrations might not be ready yet
    }

    // Step 3: Run Seed (only if RUN_SEED env var is set)
    const shouldSeed = process.env.RUN_SEED === 'true' || process.env.RUN_SEED === '1';
    
    if (shouldSeed) {
      log('3️⃣  Seeding database (RUN_SEED=true)...', 'blue');
      try {
        execSync('npm run seed', {
          stdio: 'inherit',
          cwd: backendPath,
          env: process.env,
        });
        log('✅ Database seeded successfully\n', 'green');
      } catch (error) {
        log('⚠️  Seeding failed. You can run it manually later with: npm run seed\n', 'yellow');
        // Don't exit - seeding is optional
      }
    } else {
      log('3️⃣  Skipping seed (set RUN_SEED=true to enable)\n', 'yellow');
    }

    log('✅ Post-install setup completed!\n', 'green');

  } catch (error) {
    log(`❌ Post-install script error: ${error.message}`, 'red');
    log('This is usually not critical. You can run setup manually later.\n', 'yellow');
    // Don't exit with error code - postinstall failures shouldn't break npm install
  }
}

runPostInstall();

