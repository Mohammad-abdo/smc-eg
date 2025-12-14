import express from 'express';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

router.get('/', chatController.getAllChatMessages);
router.post('/', chatController.createChatMessage);
router.put('/:id', chatController.updateChatMessage);

export default router;

