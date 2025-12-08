// Database Connection Test Script
// This script helps diagnose database connection issues

import 'dotenv/config';
import { getDatabaseUrl } from '../lib/env.js';

console.log('🔍 Testing database connection...\n');

// Display current configuration (without password)
console.log('📋 Current Configuration:');
console.log(`   Host: ${process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost'}`);
console.log(`   Port: ${process.env.DB_PORT || process.env.DATABASE_PORT || '3306'}`);
console.log(`   User: ${process.env.DB_USER || process.env.DATABASE_USER || 'root'}`);
console.log(`   Database: ${process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard'}`);
console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(not set)'}`);
console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? 'Set' : 'Not set'}\n`);

// Test 1: Try basic MySQL connection using mysql2
console.log('🧪 Test 1: Testing basic MySQL connection...');
try {
  const mysql = await import('mysql2/promise');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306),
    user: process.env.DB_USER || process.env.DATABASE_USER || 'root',
    password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '',
    connectTimeout: 5000, // 5 second timeout
  });
  
  console.log('✅ Basic MySQL connection successful!');
  
  // Test if database exists
  const [databases] = await connection.execute('SHOW DATABASES');
  const dbName = process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard';
  const dbExists = databases.some(db => db.Database === dbName);
  
  if (dbExists) {
    console.log(`✅ Database '${dbName}' exists`);
  } else {
    console.log(`⚠️  Database '${dbName}' does NOT exist`);
    console.log(`   Available databases: ${databases.map(db => db.Database).join(', ')}`);
  }
  
  await connection.end();
} catch (error) {
  console.error('❌ Basic MySQL connection failed:', error.message);
  console.error('\n💡 Troubleshooting steps:');
  console.error('   1. Ensure MySQL/MariaDB server is running');
  console.error('   2. Check if the host and port are correct');
  console.error('   3. Verify username and password');
  console.error('   4. Check firewall settings');
  process.exit(1);
}

// Test 2: Try Prisma connection
console.log('\n🧪 Test 2: Testing Prisma connection...');
try {
  const prisma = await import('../lib/prisma.js');
  const prismaClient = prisma.default;
  
  // Try a simple query with timeout
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
  });
  
  const queryPromise = prismaClient.$queryRaw`SELECT 1 as test`;
  
  await Promise.race([queryPromise, timeoutPromise]);
  console.log('✅ Prisma connection successful!');
  
  await prismaClient.$disconnect();
} catch (error) {
  console.error('❌ Prisma connection failed:', error.message);
  console.error('\n💡 Troubleshooting steps:');
  console.error('   1. Run: npx prisma generate');
  console.error('   2. Ensure database migrations are applied: npx prisma migrate dev');
  console.error('   3. Check Prisma adapter configuration');
  process.exit(1);
}

console.log('\n✅ All connection tests passed!');
console.log('💡 You can now run: npm run seed');

