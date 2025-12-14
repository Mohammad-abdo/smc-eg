// Setup script to build DATABASE_URL before Prisma commands
// This ensures DATABASE_URL is available in .env file
import { config } from 'dotenv';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '.env');

// Load existing .env if it exists
if (existsSync(envPath)) {
  config({ path: envPath });
}

// Build DATABASE_URL if not provided
function buildDatabaseUrl() {
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

const databaseUrl = buildDatabaseUrl();

// Update .env file with DATABASE_URL
if (existsSync(envPath)) {
  let envContent = readFileSync(envPath, 'utf8');
  
  // Remove old DATABASE_URL if exists
  envContent = envContent.replace(/^DATABASE_URL=.*$/m, '');
  
  // Add new DATABASE_URL at the top
  if (!envContent.includes('DATABASE_URL=')) {
    envContent = `DATABASE_URL="${databaseUrl}"\n${envContent}`;
  } else {
    envContent = envContent.replace(/^(DATABASE_URL=.*)$/m, `DATABASE_URL="${databaseUrl}"`);
  }
  
  writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ DATABASE_URL updated in .env file');
} else {
  // Create .env file from template
  const templatePath = resolve(__dirname, 'env.template');
  let envContent = existsSync(templatePath) 
    ? readFileSync(templatePath, 'utf8')
    : '';
  
  // Add DATABASE_URL
  envContent = `DATABASE_URL="${databaseUrl}"\n${envContent}`;
  
  writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ .env file created with DATABASE_URL');
}

console.log(`📊 DATABASE_URL: ${databaseUrl.replace(/:([^:@]+)@/, ':***@')}`);

