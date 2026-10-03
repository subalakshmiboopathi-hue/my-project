import express from 'express';
import {
  submitFeedback,
  getWorkshopFeedback,
  getAllFeedback
} from '../controllers/feedbackController.js';
import { authenticateToken, requireAdmin, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Student submits feedback
router.post('/', authenticateToken, requireStudent, submitFeedback);

// Workshop feedback details (Public / Logged in)
router.get('/workshop/:workshopId', getWorkshopFeedback);

// Admin gets all feedbacks
router.get('/all', authenticateToken, requireAdmin, getAllFeedback);

export default router;
