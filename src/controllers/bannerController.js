// Banners Controller
import prisma from '../config/database.js';

export const getAllBanners = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    res.json(banners);
  } catch (error) {
    // Handle connection errors
    if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.message?.includes('ECONNRESET')) {
      return res.status(503).json({ 
        error: 'Database connection error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    next(error);
  }
};

export const getBannerById = async (req, res, next) => {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!banner) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    res.json(banner);
  } catch (error) {
    next(error);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const banner = await prisma.banner.create({ data: req.body });
    res.json(banner);
  } catch (error) {
    // Handle connection errors
    if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.message?.includes('ECONNRESET')) {
      return res.status(503).json({ 
        error: 'Database connection error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    next(error);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const bannerId = parseInt(req.params.id);
    
    // Retry logic for connection errors
    let retries = 2;
    let lastError;
    
    while (retries >= 0) {
      try {
        const banner = await prisma.banner.update({
          where: { id: bannerId },
          data: req.body,
        });
        
        return res.json(banner);
      } catch (error) {
        lastError = error;
        
        // Check if it's a connection error
        const isConnectionError = error.code === 'ECONNRESET' || 
                                  error.code === 'ECONNREFUSED' || 
                                  error.message?.includes('ECONNRESET') ||
                                  error.message?.includes('write ECONNRESET');
        
        if (isConnectionError && retries > 0) {
          retries--;
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 200 * (3 - retries)));
          continue;
        } else {
          // Not a connection error or no more retries, break and handle
          break;
        }
      }
    }
    
    // Handle final error
    if (lastError.code === 'P2025') {
      return res.status(404).json({ error: 'Banner not found' });
    }
    
    // If it's still a connection error after retries
    const isConnectionError = lastError.code === 'ECONNRESET' || 
                              lastError.code === 'ECONNREFUSED' || 
                              lastError.message?.includes('ECONNRESET') ||
                              lastError.message?.includes('write ECONNRESET');
    
    if (isConnectionError) {
      return res.status(503).json({ 
        error: 'Database connection error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? lastError.message : undefined
      });
    }
    
    next(lastError);
  } catch (error) {
    next(error);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    await prisma.banner.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ success: true });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Banner not found' });
    }
    // Handle connection errors
    if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || error.message?.includes('ECONNRESET')) {
      return res.status(503).json({ 
        error: 'Database connection error. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    next(error);
  }
};

