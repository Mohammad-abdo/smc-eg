import express from 'express';
import * as tenderController from '../controllers/tenderController.js';

const router = express.Router();

router.put('/:id', tenderController.updateTenderSubmission);

export default router;

