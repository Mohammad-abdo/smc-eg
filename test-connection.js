// Simple database connection test script
// Run with: node test-connection.js

import 'dotenv/config';
import mysql from 'mysql2/promise';

async function testConnection() {
  console.log('🔌 Testing MySQL/MariaDB Connection...\n');
  
  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'smc_dashboard',
    port: Number(process.env.DB_PORT || 3306),
    connectTimeout: 10000, // 10 seconds
  };

  console.log('📋 Connection Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Password: ${config.password ? '***' : '(not set)'}`);
  console.log(`   Database: ${config.database}\n`);

  try {
    console.log('⏳ Attempting to connect...');
    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!\n');
    
    // Test query
    console.log('⏳ Testing query...');
    const [rows] = await connection.execute('SELECT 1 as test, DATABASE() as current_db, VERSION() as version');
    console.log('✅ Query successful!');
    console.log('   Result:', rows[0]);
    console.log(`   Current Database: ${rows[0].current_db}`);
    console.log(`   MySQL Version: ${rows[0].version}\n`);
    
    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [config.database]);
    if (databases.length === 0) {
      console.log(`⚠️  Warning: Database "${config.database}" does not exist!`);
      console.log(`   Create it with: CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`);
    } else {
      console.log(`✅ Database "${config.database}" exists\n`);
    }
    
    await connection.end();
    console.log('✅ Connection closed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!\n');
    console.error('Error Details:');
    console.error(`   Code: ${error.code || 'N/A'}`);
    console.error(`   Message: ${error.message}\n`);
    
    console.error('🔍 Troubleshooting:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   → MySQL/MariaDB server is not running or not accessible');
      console.error('   → Check if MySQL service is running:');
      console.error('      Windows: services.msc (look for MySQL)');
      console.error('      Linux: sudo systemctl status mysql');
      console.error('      Mac: brew services list');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR' || error.code === 'ER_NOT_SUPPORTED_AUTH_MODE') {
      console.error('   → Authentication failed - check username and password');
      console.error('   → Verify credentials in .env file');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(`   → Database "${config.database}" does not exist`);
      console.error(`   → Create it: CREATE DATABASE ${config.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   → Connection timeout - server might be unreachable');
      console.error('   → Check firewall settings');
      console.error('   → Verify host and port are correct');
    } else {
      console.error('   → Check your .env file configuration');
      console.error('   → Verify MySQL/MariaDB is installed and running');
    }
    
    console.error('\n💡 Next Steps:');
    console.error('   1. Ensure MySQL/MariaDB is running');
    console.error('   2. Check .env file in the back/ directory');
    console.error('   3. Verify database credentials');
    console.error('   4. Create database if it does not exist');
    
    process.exit(1);
  }
}

testConnection();






