// MySQL2 pool for raw queries
// This pool is separate from Prisma adapter pool to avoid conflicts
import mysql from 'mysql2/promise';

const mysqlPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smc_dashboard',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  charset: 'utf8mb4',
  // Note: acquireTimeout and timeout are pool-level options, not connection options
  // They should be set in pool configuration, not connection config
});

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('beforeExit', async () => {
    await mysqlPool.end().catch(() => {});
  });
  
  process.on('SIGINT', async () => {
    await mysqlPool.end().catch(() => {});
  });
  
  process.on('SIGTERM', async () => {
    await mysqlPool.end().catch(() => {});
  });
}

export default mysqlPool;

