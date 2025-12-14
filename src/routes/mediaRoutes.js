// Media Routes
import express from 'express';
import * as mediaController from '../controllers/mediaController.js';

const router = express.Router();

router.get('/', mediaController.getAllMedia);
router.post('/upload', mediaController.uploadMedia);
router.delete('/:id', mediaController.deleteMedia);

export default router;

