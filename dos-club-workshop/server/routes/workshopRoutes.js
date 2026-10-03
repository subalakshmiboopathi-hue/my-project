import express from 'express';
import {
  getAllWorkshops,
  getWorkshopById,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop
} from '../controllers/workshopController.js';
import { registerForWorkshop, getWorkshopRegistrations } from '../controllers/registrationController.js';
import { getWorkshopAttendance, markAttendance } from '../controllers/attendanceController.js';
import { getWorkshopFeedback, submitFeedback } from '../controllers/feedbackController.js';
import { authenticateToken, requireAdmin, requireStudent, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public / Optional auth for status check
router.get('/', optionalAuth, getAllWorkshops);
router.get('/:id', optionalAuth, getWorkshopById);

// Admin-only CRUD
router.post('/', authenticateToken, requireAdmin, createWorkshop);
router.put('/:id', authenticateToken, requireAdmin, updateWorkshop);
router.delete('/:id', authenticateToken, requireAdmin, deleteWorkshop);

// Nested resource endpoints
router.post('/:id/register', authenticateToken, requireStudent, registerForWorkshop);
router.get('/:id/registrations', authenticateToken, requireAdmin, getWorkshopRegistrations);
router.get('/:id/attendance', authenticateToken, requireAdmin, getWorkshopAttendance);
router.post('/:id/attendance', authenticateToken, requireAdmin, markAttendance);
router.get('/:id/feedback', getWorkshopFeedback);
router.post('/:id/feedback', authenticateToken, requireStudent, submitFeedback);

export default router;
