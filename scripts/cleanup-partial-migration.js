import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smc_dashboard',
};

// Tables that might have been created by the partial migration
const tablesToCheck = [
  'product_categories',
  'products',
];

async function cleanupPartialMigration() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to database\n');

    for (const tableName of tablesToCheck) {
      try {
        console.log(`Checking if table '${tableName}' exists...`);
        const [rows] = await connection.query(
          `SELECT COUNT(*) as count FROM information_schema.tables 
           WHERE table_schema = ? AND table_name = ?`,
          [connectionConfig.database, tableName]
        );

        if (rows[0].count > 0) {
          console.log(`⚠️  Table '${tableName}' exists. Dropping...`);
          await connection.query(`DROP TABLE IF EXISTS \`${tableName}\``);
          console.log(`✅ Dropped table '${tableName}'\n`);
        } else {
          console.log(`✅ Table '${tableName}' does not exist\n`);
        }
      } catch (error) {
        console.error(`❌ Error checking/dropping table '${tableName}':`, error.message);
      }
    }

    console.log('✅ Cleanup complete! You can now reapply the migration.');
    console.log('\n📝 Next steps:');
    console.log('   cd backend');
    console.log('   npx prisma migrate deploy');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

cleanupPartialMigration();

