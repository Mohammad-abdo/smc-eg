// Health Check Controller
import prisma from '../config/database.js';

export const healthCheck = async (req, res, next) => {
  try {
    // Test database connection with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 5000);
    });
    
    const dbPromise = prisma.$queryRaw`SELECT 1 as test`;
    
    await Promise.race([dbPromise, timeoutPromise]);
    
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

