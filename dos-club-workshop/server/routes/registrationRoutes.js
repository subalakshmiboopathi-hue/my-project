import express from 'express';
import {
  registerForWorkshop,
  getMyRegistrations,
  getWorkshopRegistrations,
  cancelRegistration
} from '../controllers/registrationController.js';
import { authenticateToken, requireAdmin, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Student registers for a workshop
router.post('/', authenticateToken, requireStudent, registerForWorkshop);

// Student views their registrations
router.get('/my', authenticateToken, requireStudent, getMyRegistrations);

// Admin views registrations for a workshop
router.get('/workshop/:workshopId', authenticateToken, requireAdmin, getWorkshopRegistrations);

// Cancel registration
router.delete('/:workshopId', authenticateToken, cancelRegistration);

export default router;
