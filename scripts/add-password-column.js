// Script to add password column to users table
// Run with: node scripts/add-password-column.js

import mysql from 'mysql2/promise';
import 'dotenv/config';

async function addPasswordColumn() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smc_dashboard',
      port: Number(process.env.DB_PORT || 3306),
    });

    console.log('🔌 Connected to database');
    
    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'password'
    `, [process.env.DB_NAME || 'smc_dashboard']);

    if (columns.length > 0) {
      console.log('✅ Password column already exists in users table');
      return;
    }

    // Add password column
    console.log('➕ Adding password column to users table...');
    await connection.execute(`
      ALTER TABLE users ADD COLUMN password VARCHAR(255) NULL
    `);
    
    console.log('✅ Password column added successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Run: npm run seed');
    console.log('   2. Admin credentials:');
    console.log('      Email: admin@smc.com');
    console.log('      Password: Admin@123\n');
    
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✅ Password column already exists');
    } else {
      console.error('❌ Error adding password column:', error.message);
      throw error;
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

addPasswordColumn()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

