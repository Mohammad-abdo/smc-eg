// Authentication middleware
import bcrypt from 'bcrypt';
import prisma from '../config/database.js';

// Optional: JWT-based authentication can be added here
// For now, this is a placeholder for future authentication

export const authenticate = async (req, res, next) => {
  // TODO: Implement JWT or session-based authentication
  // For now, this is a placeholder
  next();
};

export const requireAuth = async (req, res, next) => {
  // TODO: Implement authentication check
  // For now, allow all requests
  next();
};

export const requireAdmin = async (req, res, next) => {
  // TODO: Implement admin role check
  // For now, allow all requests
  next();
};

// Helper function to hash password
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to compare password
export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

