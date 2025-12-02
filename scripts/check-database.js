#!/usr/bin/env node
// Database Connection Check Script
// This script checks if database is accessible and creates it if needed

require('dotenv').config();
const mysql = require('mysql2/promise');
const { getDatabaseUrl } = require('../lib/env');

console.log('🔍 Checking database connection...\n');

// Get connection details
const host = process.env.DB_HOST || process.env.DATABASE_HOST || 'localhost';
const user = process.env.DB_USER || process.env.DATABASE_USER || 'root';
const password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || '';
const database = process.env.DB_NAME || process.env.DATABASE_NAME || 'smc_dashboard';
const port = Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306);

console.log('Connection details:');
console.log(`  Host: ${host}`);
console.log(`  Port: ${port}`);
console.log(`  User: ${user}`);
console.log(`  Database: ${database}`);
console.log(`  Password: ${password ? '***' : '(empty)'}\n`);

async function checkDatabase() {
  try {
    // First, try to connect without database (to create it if needed)
    console.log('1. Connecting to MySQL server...');
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    console.log('✅ Connected to MySQL server\n');

    // Check if database exists
    console.log('2. Checking if database exists...');
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [database]);
    
    if (databases.length === 0) {
      console.log(`⚠️  Database "${database}" does not exist.`);
      console.log(`   Creating database "${database}"...`);
      
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
      console.log(`✅ Database "${database}" created\n`);
    } else {
      console.log(`✅ Database "${database}" exists\n`);
    }

    await connection.end();

    // Now try to connect to the database
    console.log('3. Connecting to database...');
    const dbConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
    });

    console.log(`✅ Successfully connected to database "${database}"\n`);
    await dbConnection.end();

    console.log('✅ Database connection check complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run prisma:migrate');
    console.log('   2. Or: npm run prisma:push (for development)');
    
    return true;
  } catch (error) {
    console.error('\n❌ Database connection failed!\n');
    console.error('Error:', error.message);
    console.error('\n💡 Possible solutions:');
    console.error('   1. Make sure MySQL is running');
    console.error('   2. Check your .env file in backend/ folder');
    console.error('   3. Verify database credentials');
    console.error('   4. For Windows: Check Services → MySQL');
    console.error('   5. For remote database: Check firewall and IP whitelist');
    console.error('\n📝 Example .env file:');
    console.error('   DB_HOST=localhost');
    console.error('   DB_USER=root');
    console.error('   DB_PASSWORD=your_password');
    console.error('   DB_NAME=smc_dashboard');
    console.error('   DB_PORT=3306');
    
    return false;
  }
}

checkDatabase().then(success => {
  process.exit(success ? 0 : 1);
});

