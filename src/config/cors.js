// CORS configuration
import cors from 'cors';

const allowedOrigins = [
  'https://smc-eg.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3001',
];

// Add FRONTEND_URL from environment if provided
if (process.env.FRONTEND_URL) {
  const frontendUrl = process.env.FRONTEND_URL.trim();
  // Remove trailing slashes and any extra characters
  const cleanUrl = frontendUrl.replace(/\/+$/, '').split(' ')[0].split('|')[0].trim();
  if (cleanUrl && !allowedOrigins.includes(cleanUrl)) {
    allowedOrigins.push(cleanUrl);
    console.log(`✅ Added FRONTEND_URL to CORS: ${cleanUrl}`);
  }
}

console.log('🌐 Allowed CORS origins:', allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check if it's a localhost variant
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    
    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ CORS: Allowing origin in development: ${origin}`);
      return callback(null, true);
    }
    
    // In production, log and block
    console.warn(`❌ CORS: Blocked origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-Request-ID',
    'X-Session-ID',
    'X-Vercel-Cache-Control',
    'CDN-Cache-Control',
    'Vercel-CDN-Cache-Control',
    'X-Cache-Bypass',
    'Cache-Control',
    'Pragma',
    'Expires',
  ],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
};

export default cors(corsOptions);

