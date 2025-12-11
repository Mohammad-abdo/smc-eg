// CommonJS version of env.js for Prisma config compatibility
// This ensures DATABASE_URL is built before Prisma reads it

require('dotenv').config();

function getDatabaseUrl() {
  // Option 1: If DATABASE_URL is already set, validate and use it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    let dbUrl = process.env.DATABASE_URL.trim();
    
    // Validate DATABASE_URL format - if invalid, rebuild from separate variables
    try {
      // Check for common invalid patterns:
      // 1. Double colon in password section (e.g., password:@host)
      // 2. Invalid URL structure
      // 3. Port parsing issues
      const hasDoubleColon = dbUrl.match(/mysql:\/\/[^@]+:.*:.*@/);
      const urlMatch = dbUrl.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
      const hasInvalidPort = !/mysql:\/\/[^@]+@[^:]+:\d+/.test(dbUrl);
      
      // If URL has obvious issues, rebuild from separate variables
      if (hasDoubleColon || hasInvalidPort || !urlMatch) {
        console.warn('⚠️  Invalid DATABASE_URL format detected. Rebuilding from DB_* variables...');
        // Fall through to Option 2 (build from separate variables)
      } else {
        // URL seems valid, check for SSL
        const hasSSL = dbUrl.includes('ssl') || dbUrl.includes('ssl-mode');
        
        // If it's a remote database URL without SSL params, add them
        if (!hasSSL && (dbUrl.includes('railway') || dbUrl.includes('rlwy') || dbUrl.includes('ondigitalocean.com'))) {
          const separator = dbUrl.includes('?') ? '&' : '?';
          dbUrl = `${dbUrl}${separator}ssl={"rejectUnauthorized":false}&connect_timeout=60&acquire_timeout=60`;
        }
        
        process.env.DATABASE_URL = dbUrl;
        return dbUrl;
      }
    } catch (error) {
      console.warn('⚠️  Error validating DATABASE_URL. Rebuilding from DB_* variables...', error.message);
      // Fall through to Option 2
    }
  }

  // Option 2: Build DATABASE_URL from separate variables
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'smc-backend';
  const port = process.env.DB_PORT || '3306';

  // Encode password for URL (handle special characters like @, :, /, etc.)
  const encodedPassword = encodeURIComponent(password);

  // Build MySQL connection URL
  let url = `mysql://${user}:${encodedPassword}@${host}:${port}/${database}`;
  
  // Add SSL and timeout parameters for remote databases
  const isRemote = host.includes('railway') || 
                   host.includes('rlwy') || 
                   host.includes('ondigitalocean.com') ||
                   (!host.includes('localhost') && !host.includes('127.0.0.1'));
  
  if (isRemote) {
    url += '?ssl={"rejectUnauthorized":false}&connect_timeout=60&acquire_timeout=60';
  }
  
  // Set it for Prisma to use
  process.env.DATABASE_URL = url;
  
  return url;
}

// Initialize DATABASE_URL on module load
getDatabaseUrl();

module.exports = { getDatabaseUrl, DATABASE_URL: process.env.DATABASE_URL };
