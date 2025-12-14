// Health Routes
import express from 'express';
import * as healthController from '../controllers/healthController.js';

const router = express.Router();

router.get('/', healthController.healthCheck);

export default router;

