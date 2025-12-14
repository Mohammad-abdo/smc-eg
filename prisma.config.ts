// Prisma Configuration for Prisma v7
// In Prisma 7, datasource URL must be in this file, not in schema.prisma
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: resolve(__dirname, '.env') });

// Build DATABASE_URL if not provided
function getDatabaseUrl() {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL.trim();
  }

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smc-backend';
  const port = process.env.DB_PORT || '3306';

  const encodedPassword = encodeURIComponent(password);
  let url = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}`;
  
  const isRemote = host.includes('ondigitalocean.com') ||
                   (!host.includes('localhost') && !host.includes('127.0.0.1'));
  
  if (isRemote) {
    url += '?ssl={"rejectUnauthorized":false}&connect_timeout=60&acquire_timeout=60';
  }
  
  return url;
}

// Export Prisma config with datasource URL
export default {
  datasource: {
    url: getDatabaseUrl(),
  },
};

