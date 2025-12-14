// Database helper functions using Prisma
// NOTE: This file is deprecated and kept for backward compatibility only
// Please use src/config/database.js and src/utils/formatters.js instead

import prisma from '../src/config/database.js';
export { formatProduct, formatCategory } from '../src/utils/formatters.js';

// Re-export prisma for backward compatibility
export { prisma };
