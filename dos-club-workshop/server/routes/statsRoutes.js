import express from 'express';
import { getAdminStats, getStudentStats } from '../controllers/statsController.js';
import { authenticateToken, requireAdmin, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Admin stats overview
router.get('/admin', authenticateToken, requireAdmin, getAdminStats);

// Student stats overview
router.get('/student', authenticateToken, requireStudent, getStudentStats);

export default router;
