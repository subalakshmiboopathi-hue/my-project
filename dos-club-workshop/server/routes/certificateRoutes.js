import express from 'express';
import {
  generateCertificate,
  getMyCertificates,
  getCertificateById
} from '../controllers/certificateController.js';
import { authenticateToken, requireStudent } from '../middleware/auth.js';

const router = express.Router();

// Student generates certificate (requires present attendance)
router.post('/generate', authenticateToken, requireStudent, generateCertificate);

// Student gets their earned certificates
router.get('/my', authenticateToken, requireStudent, getMyCertificates);

// Public / View endpoint for printable certificate details
router.get('/view/:certificateId', getCertificateById);

export default router;
