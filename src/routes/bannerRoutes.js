import express from 'express';
import * as bannerController from '../controllers/bannerController.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

router.get('/', bannerController.getAllBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/', (req, res, next) => {
  // Set type to 'home' for banners BEFORE multer processes
  // Multer needs this in req.body to determine the destination folder
  // We set it before multer runs, and it will be in FormData anyway
  req.body.type = 'home';
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, bannerController.createBanner);
router.put('/:id', (req, res, next) => {
  // Set type to 'home' for banners BEFORE multer processes
  req.body.type = 'home';
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }
    next();
  });
}, bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

export default router;

