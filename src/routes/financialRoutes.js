import express from 'express';
import * as financialController from '../controllers/financialController.js';

const router = express.Router();

// Revenue routes
router.get('/revenue', financialController.getAllRevenue);
router.post('/revenue', financialController.createRevenue);
router.put('/revenue/:id', financialController.updateRevenue);
router.delete('/revenue/:id', financialController.deleteRevenue);

// Production routes
router.get('/production', financialController.getAllProduction);
router.post('/production', financialController.createProduction);
router.put('/production/:id', financialController.updateProduction);
router.delete('/production/:id', financialController.deleteProduction);

// Export routes
router.get('/export', financialController.getAllExport);
router.post('/export', financialController.createExport);
router.put('/export/:id', financialController.updateExport);
router.delete('/export/:id', financialController.deleteExport);

export default router;

