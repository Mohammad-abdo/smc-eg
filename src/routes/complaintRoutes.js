import express from 'express';
import * as complaintController from '../controllers/complaintController.js';

const router = express.Router();

router.get('/', complaintController.getAllComplaints);
router.get('/:id', complaintController.getComplaintById);
router.post('/', complaintController.createComplaint);
router.put('/:id', complaintController.updateComplaint);

export default router;

