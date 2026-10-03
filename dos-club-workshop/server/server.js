import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initDB } from './db/index.js';
import { seedDatabase } from './db/seed.js';

import authRoutes from './routes/authRoutes.js';
import workshopRoutes from './routes/workshopRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(morgan('dev'));

import { getMyRegistrations } from './controllers/registrationController.js';
import { getMyAttendance, markAttendance } from './controllers/attendanceController.js';
import { submitFeedback } from './controllers/feedbackController.js';
import { getMyCertificates, generateCertificate } from './controllers/certificateController.js';
import { authenticateToken, requireStudent, requireAdmin } from './middleware/auth.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/stats', statsRoutes);

// Direct top-level endpoint aliases as requested
app.get('/api/my-registrations', authenticateToken, requireStudent, getMyRegistrations);
app.get('/api/my-attendance', authenticateToken, requireStudent, getMyAttendance);
app.get('/api/my-certificates', authenticateToken, requireStudent, getMyCertificates);
app.post('/api/attendance', authenticateToken, requireAdmin, markAttendance);
app.post('/api/feedback', authenticateToken, requireStudent, submitFeedback);
app.post('/api/certificates', authenticateToken, requireStudent, generateCertificate);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'DOS Club Workshop Management API is running smoothly.', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start Server & verify database
const startServer = async () => {
  try {
    await initDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 DOS Club Workshop Server running on http://localhost:${PORT}`);
      console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
