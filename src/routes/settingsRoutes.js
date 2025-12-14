import express from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = express.Router();

router.get('/', settingsController.getAllSettings);
router.get('/:key', settingsController.getSettingByKey);
router.post('/', settingsController.createOrUpdateSetting);

export default router;

