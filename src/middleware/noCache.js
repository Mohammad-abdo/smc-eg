// No-cache middleware for API routes
export const noCache = (req, res, next) => {
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private, s-maxage=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Last-Modified': new Date().toUTCString(),
    'ETag': `"${Date.now()}-${Math.random()}"`,
    'X-Content-Type-Options': 'nosniff',
    'X-Accel-Expires': '0',
    'Vary': '*',
  });
  next();
};

