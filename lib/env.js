// Environment variables helper
// Builds DATABASE_URL from separate variables if not provided
import 'dotenv/config';

export function getDatabaseUrl() {
  // If DATABASE_URL is already set, use it
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Otherwise, build it from separate variables
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smc_dashboard';
  const port = process.env.DB_PORT || '3306';

  // Encode password for URL (handle special characters)
  const encodedPassword = encodeURIComponent(password);

  // Build MySQL connection URL
  const url = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}`;
  
  // Set it for Prisma
  process.env.DATABASE_URL = url;
  
  return url;
}

// Initialize DATABASE_URL
getDatabaseUrl();

export const DATABASE_URL = process.env.DATABASE_URL;
