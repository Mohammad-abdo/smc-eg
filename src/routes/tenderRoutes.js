import express from 'express';
import * as tenderController from '../controllers/tenderController.js';

const router = express.Router();

router.get('/', tenderController.getAllTenders);
router.get('/:id', tenderController.getTenderById);
router.post('/', tenderController.createTender);
router.put('/:id', tenderController.updateTender);
router.delete('/:id', tenderController.deleteTender);
// Support both /tenders/submit (with tenderId in body) and /tenders/:id/submit (with tenderId in URL)
router.post('/submit', tenderController.submitTenderFromBody);
router.post('/:id/submit', tenderController.submitTender);
router.get('/:id/submissions', tenderController.getTenderSubmissions);

export default router;

