// Main routes index
import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import newsRoutes from './newsRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import memberRoutes from './memberRoutes.js';
import clientRoutes from './clientRoutes.js';
import contactRoutes from './contactRoutes.js';
import complaintRoutes from './complaintRoutes.js';
import tenderRoutes from './tenderRoutes.js';
import tenderSubmissionRoutes from './tenderSubmissionRoutes.js';
import financialRoutes from './financialRoutes.js';
import chatRoutes from './chatRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import statisticsRoutes from './statisticsRoutes.js';
import healthRoutes from './healthRoutes.js';
import mediaRoutes from './mediaRoutes.js';

const router = express.Router();

// Health check
router.use('/health', healthRoutes);

// API routes
router.use('/product-categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/news', newsRoutes);
router.use('/banners', bannerRoutes);
router.use('/members', memberRoutes);
router.use('/clients', clientRoutes);
router.use('/contacts', contactRoutes);
router.use('/complaints', complaintRoutes);
router.use('/tenders', tenderRoutes);
router.use('/tender-submissions', tenderSubmissionRoutes);
router.use('/financial', financialRoutes);
router.use('/chat', chatRoutes);
router.use('/settings', settingsRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/media', mediaRoutes);

export default router;

