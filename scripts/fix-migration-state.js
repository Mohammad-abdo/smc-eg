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

const failedMigrationName = '20251202182334';

async function fixMigrationState() {
  let connection;
  
  try {
    console.log('🔗 Connecting to database...');
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to database\n');

    // Check if _prisma_migrations table exists
    console.log('Checking _prisma_migrations table...');
    const [tables] = await connection.query(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = '_prisma_migrations'`,
      [connectionConfig.database]
    );

    if (tables[0].count === 0) {
      console.log('⚠️  _prisma_migrations table does not exist. This is normal for a fresh database.\n');
      console.log('✅ Migration state is clean. You can now apply migrations.\n');
      return;
    }

    // Check for the failed migration
    console.log(`Checking for failed migration '${failedMigrationName}'...`);
    const [migrations] = await connection.query(
      `SELECT * FROM _prisma_migrations WHERE migration_name = ?`,
      [failedMigrationName]
    );

    if (migrations.length === 0) {
      console.log(`✅ No record of migration '${failedMigrationName}' found.\n`);
      console.log('✅ Migration state is clean. You can now apply migrations.\n');
      return;
    }

    const migration = migrations[0];
    console.log(`Found migration record:`, {
      migration_name: migration.migration_name,
      finished_at: migration.finished_at,
      rolled_back_at: migration.rolled_back_at,
    });

    // Delete the failed migration record
    console.log(`\n🗑️  Deleting failed migration record...`);
    await connection.query(
      `DELETE FROM _prisma_migrations WHERE migration_name = ?`,
      [failedMigrationName]
    );
    console.log(`✅ Deleted migration record '${failedMigrationName}'\n`);

    console.log('✅ Migration state fixed! You can now reapply the migration.');
    console.log('\n📝 Next steps:');
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

fixMigrationState();

