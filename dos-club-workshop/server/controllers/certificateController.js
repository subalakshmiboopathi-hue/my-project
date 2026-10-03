import { query } from '../db/index.js';

// Generate or fetch certificate for a workshop (Student)
export const generateCertificate = async (req, res) => {
  try {
    const workshop_id = req.params.id || req.body.workshop_id;
    const student_id = req.user.id;

    if (!workshop_id) {
      return res.status(400).json({ message: 'Workshop ID is required.' });
    }

    // 1. Check if certificate already exists
    const existingCert = await query(
      `SELECT c.id, c.certificate_id, c.issued_at, w.title, u.name
       FROM certificates c
       JOIN workshops w ON c.workshop_id = w.id
       JOIN users u ON c.student_id = u.id
       WHERE c.workshop_id = $1 AND c.student_id = $2`,
      [workshop_id, student_id]
    );

    if (existingCert.rows.length > 0) {
      return res.json({
        message: 'Certificate already generated!',
        certificate: existingCert.rows[0]
      });
    }

    // 2. Check if student attended and is marked 'present'
    const attendanceCheck = await query(
      `SELECT a.status, w.title, w.date
       FROM attendance a
       JOIN workshops w ON a.workshop_id = w.id
       WHERE a.workshop_id = $1 AND a.student_id = $2`,
      [workshop_id, student_id]
    );

    if (attendanceCheck.rows.length === 0 || attendanceCheck.rows[0].status !== 'present') {
      return res.status(400).json({
        message: 'Certificate generation requires verified attendance. You must be marked as "Present" by the administrator.'
      });
    }

    // 3. Generate unique Certificate ID (e.g. DOS-2026-W1-8A3F)
    const year = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certificateId = `DOS-${year}-W${workshop_id}-${randomSuffix}`;

    // 4. Insert certificate
    const insertRes = await query(
      `INSERT INTO certificates (workshop_id, student_id, certificate_id, issued_at)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING id, workshop_id, student_id, certificate_id, issued_at`,
      [workshop_id, student_id, certificateId]
    );

    return res.status(201).json({
      message: 'Certificate generated successfully!',
      certificate: insertRes.rows[0]
    });
  } catch (error) {
    console.error('generateCertificate error:', error);
    return res.status(500).json({ message: 'Server error generating certificate.' });
  }
};

// Get current student's certificates
export const getMyCertificates = async (req, res) => {
  try {
    const student_id = req.user.id;

    const sql = `
      SELECT 
        c.id,
        c.certificate_id,
        c.issued_at,
        w.id AS workshop_id,
        w.title AS workshop_title,
        TO_CHAR(w.date, 'YYYY-MM-DD') AS workshop_date,
        w.venue,
        w.instructor,
        u.name AS student_name,
        u.email AS student_email
      FROM certificates c
      JOIN workshops w ON c.workshop_id = w.id
      JOIN users u ON c.student_id = u.id
      WHERE c.student_id = $1
      ORDER BY c.issued_at DESC
    `;

    const result = await query(sql, [student_id]);
    return res.json({ certificates: result.rows });
  } catch (error) {
    console.error('getMyCertificates error:', error);
    return res.status(500).json({ message: 'Server error fetching certificates.' });
  }
};

// Get certificate by ID (for print/view page)
export const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;

    const sql = `
      SELECT 
        c.id,
        c.certificate_id,
        c.issued_at,
        w.id AS workshop_id,
        w.title AS workshop_title,
        w.description AS workshop_description,
        TO_CHAR(w.date, 'FMMonth DD, YYYY') AS formatted_date,
        TO_CHAR(w.date, 'YYYY-MM-DD') AS raw_date,
        w.venue,
        w.instructor,
        u.id AS student_id,
        u.name AS student_name,
        u.email AS student_email
      FROM certificates c
      JOIN workshops w ON c.workshop_id = w.id
      JOIN users u ON c.student_id = u.id
      WHERE c.certificate_id = $1
    `;

    const result = await query(sql, [certificateId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Certificate not found.' });
    }

    return res.json({ certificate: result.rows[0] });
  } catch (error) {
    console.error('getCertificateById error:', error);
    return res.status(500).json({ message: 'Server error fetching certificate details.' });
  }
};
