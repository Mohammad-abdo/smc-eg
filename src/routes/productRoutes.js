// Product Routes
import express from 'express';
import * as productController from '../controllers/productController.js';
import { noCache } from '../middleware/noCache.js';

const router = express.Router();

router.get('/', noCache, productController.getAllProducts);
router.get('/:id', noCache, productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;

