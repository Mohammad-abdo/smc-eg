#!/usr/bin/env node
// Vercel Post-Deploy Script
// This script runs Prisma migrations after deployment
// Add to package.json: "vercel-build": "node backend/scripts/vercel-postdeploy.js"

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running post-deploy migrations...\n');

const backendPath = path.join(__dirname, '..');

try {
  // Generate Prisma Client
  console.log('1. Generating Prisma Client...');
  execSync('npx prisma generate', {
    stdio: 'inherit',
    cwd: backendPath,
    env: process.env
  });
  console.log('✅ Prisma Client generated\n');

  // Run migrations
  console.log('2. Running migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    cwd: backendPath,
    env: process.env
  });
  console.log('✅ Migrations completed\n');

  console.log('✅ Post-deploy script completed successfully!');
} catch (error) {
  console.error('❌ Post-deploy script failed:', error.message);
  process.exit(1);
}

