// Media Routes
import express from 'express';
import * as mediaController from '../controllers/mediaController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', mediaController.getAllMedia);
router.post('/upload', (req, res, next) => {
  // Set type to 'general' for general media uploads
  req.body.type = 'general';
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, mediaController.uploadMedia);
router.delete('/:id', mediaController.deleteMedia);

export default router;

