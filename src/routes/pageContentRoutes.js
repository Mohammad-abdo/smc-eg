// Page Content Routes
import express from 'express';
import {
  getAllPageContent,
  getPageContentByPage,
  getPageContentByKey,
  createOrUpdatePageContent,
  deletePageContent,
  bulkUpdatePageContent,
} from '../controllers/pageContentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (for frontend to fetch content)
router.get('/', getAllPageContent);
router.get('/page/:page', getPageContentByPage);
router.get('/page/:page/key/:key', getPageContentByKey);

// Protected routes (require authentication)
router.post('/', requireAuth, createOrUpdatePageContent);
router.put('/page/:page/key/:key', requireAuth, createOrUpdatePageContent);
router.delete('/page/:page/key/:key', requireAuth, deletePageContent);
router.post('/bulk', requireAuth, bulkUpdatePageContent);

export default router;

