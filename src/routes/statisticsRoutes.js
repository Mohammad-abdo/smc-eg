import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';

const router = express.Router();

router.get('/overview', statisticsController.getOverview);
router.get('/monthly', statisticsController.getMonthly);
router.get('/product-views', statisticsController.getProductViews);

export default router;

