// News Routes
import express from 'express';
import * as newsController from '../controllers/newsController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);
router.post('/', (req, res, next) => {
  // Set type to 'news' for news images BEFORE multer processes
  req.body.type = 'news';
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, newsController.createNews);
router.put('/:id', (req, res, next) => {
  // Set type to 'news' for news images BEFORE multer processes
  req.body.type = 'news';
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, newsController.updateNews);
router.delete('/:id', newsController.deleteNews);

export default router;

