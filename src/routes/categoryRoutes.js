// Category Routes
import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { noCache } from '../middleware/noCache.js';

const router = express.Router();

router.get('/', noCache, categoryController.getAllCategories);
router.get('/:id', noCache, categoryController.getCategoryById);
router.get('/:id/products', noCache, categoryController.getCategoryProducts);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;

