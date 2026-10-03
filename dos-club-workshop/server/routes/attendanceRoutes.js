import express from 'express';
import {
  getWorkshopAttendance,
  markAttendance,
  getMyAttendance
} from '../controllers/attendanceController.js';
import { authenticateToken, requireAdmin, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Admin views attendance for a workshop
router.get('/workshop/:workshopId', authenticateToken, requireAdmin, getWorkshopAttendance);

// Admin marks attendance (present/absent)
router.post('/mark', authenticateToken, requireAdmin, markAttendance);

// Student views their attendance
router.get('/my', authenticateToken, requireStudent, getMyAttendance);

export default router;
