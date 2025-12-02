#!/usr/bin/env node
// Automated Prisma Setup Script
// This script sets up Prisma, generates client, and runs migrations

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 Starting Prisma setup...\n');

// Step 1: Ensure DATABASE_URL is set
const envPath = path.join(__dirname, '../.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
} else {
  console.log('⚠️  .env file not found. Creating from template...');
  envContent = `# Database Configuration
# Option 1: Use DATABASE_URL (recommended for Prisma)
DATABASE_URL="mysql://root:password@localhost:3306/smc_dashboard"

# Option 2: Use separate variables (will be converted to DATABASE_URL automatically)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=smc_dashboard
DB_PORT=3306

# Server Configuration
PORT=3001
NODE_ENV=development
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file. Please update with your database credentials.\n');
}

// Check if DATABASE_URL exists, if not build from separate vars
if (!envContent.includes('DATABASE_URL=') || envContent.match(/DATABASE_URL=["']?["']/)) {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smc_dashboard';
  const port = process.env.DB_PORT || '3306';
  
  const encodedPassword = encodeURIComponent(password);
  const databaseUrl = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}`;
  
  if (!envContent.includes('DATABASE_URL=')) {
    envContent += `\nDATABASE_URL="${databaseUrl}"\n`;
  } else {
    envContent = envContent.replace(/DATABASE_URL=["'].*["']/, `DATABASE_URL="${databaseUrl}"`);
  }
  
  fs.writeFileSync(envPath, envContent);
  process.env.DATABASE_URL = databaseUrl;
  console.log('✅ DATABASE_URL configured\n');
}

// Step 2: Generate Prisma Client (Prisma v7)
console.log('📦 Generating Prisma Client (v7 with adapter)...');
try {
  // Ensure DATABASE_URL is set before generating
  const envHelper = require('../lib/env');
  envHelper.getDatabaseUrl();
  
  execSync('npx prisma generate', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL }
  });
  console.log('✅ Prisma Client generated\n');
} catch (error) {
  console.error('❌ Failed to generate Prisma Client:', error.message);
  process.exit(1);
}

// Step 3: Run migrations
console.log('🔄 Running database migrations...');
try {
  execSync('npx prisma migrate dev --name init', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  console.log('✅ Migrations completed\n');
} catch (error) {
  console.log('⚠️  Migration failed. Trying db push instead...');
  try {
    execSync('npx prisma db push', { 
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    });
    console.log('✅ Database schema pushed\n');
  } catch (pushError) {
    console.error('❌ Failed to push schema:', pushError.message);
    console.log('\n💡 Please check:');
    console.log('   1. Database is running');
    console.log('   2. DATABASE_URL is correct in .env');
    console.log('   3. Database exists');
    process.exit(1);
  }
}

console.log('✅ Prisma setup complete!');
console.log('\n📝 Next steps:');
console.log('   1. Start the server: npm run dev');
console.log('   2. Test the API: http://localhost:3001/api/health');
console.log('   3. Open Prisma Studio: npm run prisma:studio');

