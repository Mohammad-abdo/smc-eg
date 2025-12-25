// Express Backend for SMC Dashboard - Modern Clean Architecture
import express from 'express';
import 'dotenv/config';
import corsMiddleware from './src/config/cors.js';
import prisma from './src/config/database.js';
import { requestTimeout } from './src/middleware/requestTimeout.js';
import { noCache } from './src/middleware/noCache.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';
import apiRoutes from './src/routes/index.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES Modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory structure exists
const uploadsDir = path.join(__dirname, 'uploads');
const uploadFolders = ['home', 'products-images', 'news', 'clients', 'general'];

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

uploadFolders.forEach(folder => {
  const folderPath = path.join(uploadsDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Created uploads/${folder} directory`);
  }
});

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' })); // Increase limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestTimeout(30000)); // 30 seconds timeout
app.use('/api', noCache); // No cache for all API routes

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1y', // Cache images for 1 year
  etag: true,
  lastModified: true,
}));
console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
console.log(`🌐 Uploaded images accessible at: http://localhost:${PORT}/uploads/...`);

// Test database connection on startup
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma Database connected successfully!');
  } catch (error) {
    console.error('❌ Prisma Database connection failed:', error.message);
    console.error('Please check:');
    console.error('1. DATABASE_URL or DB_* variables are set correctly in .env file');
    console.error('2. Database is running and accessible');
    console.error('3. Database credentials are correct');
    console.error('4. Run: npx prisma migrate dev (to create tables)');
  }
})();

// Root route
app.get('/', (req, res) => {
    res.json({
    message: 'SMC Dashboard API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      documentation: 'See README.md for API documentation',
    },
  });
});

// Migration endpoints (keep for backward compatibility) - must be before /api routes
app.post('/api/init', async (req, res) => {
  try {
    console.log('Running Prisma migrations...');
    const backendPath = __dirname;
    process.chdir(backendPath);
    
    try {
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        cwd: backendPath,
        env: process.env
      });
      
      res.json({
        status: 'success',
        message: 'Migrations completed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (migrationError) {
      console.error('Migration error:', migrationError);
      res.status(500).json({
        status: 'error',
        message: 'Migration failed',
        error: migrationError.message,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Init endpoint error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to run migrations',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

app.get('/api/migrations/status', async (req, res) => {
  try {
    const backendPath = __dirname;
    
    try {
      const output = execSync('npx prisma migrate status', { 
        encoding: 'utf8',
        cwd: backendPath,
        env: process.env
      });
      
      res.json({
        status: 'ok',
        migrations: output,
        timestamp: new Date().toISOString(),
      });
    } catch (statusError) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to check migration status',
        error: statusError.message,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get migration status',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes - must be after specific routes like /api/init
app.use('/api', apiRoutes);
// Also mount routes without /api prefix for frontend compatibility
app.use(apiRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
  console.log(`📚 All routes registered successfully`);
});

// Handle port already in use error
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use!\n`);
    console.error('🔍 Solutions:');
    console.error(`   1. Kill the process using port ${PORT}:`);
    console.error(`      Windows: netstat -ano | findstr :${PORT}`);
    console.error(`      Then: taskkill /PID <PID> /F`);
    console.error(`      Or use: Get-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess | Stop-Process -Force`);
    console.error(`   2. Use a different port by setting PORT environment variable:`);
    console.error(`      PORT=3001 npm run dev`);
    console.error(`   3. Find and kill the process automatically:`);
    console.error(`      Windows PowerShell:`);
    console.error(`      $process = Get-NetTCPConnection -LocalPort ${PORT} -ErrorAction SilentlyContinue`);
    console.error(`      if ($process) { Stop-Process -Id $process.OwningProcess -Force }\n`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', error);
    process.exit(1);
  }
});
