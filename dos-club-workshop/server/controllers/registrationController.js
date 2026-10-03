import { query } from '../db/index.js';

// Register for a workshop (Student)
export const registerForWorkshop = async (req, res) => {
  try {
    const workshop_id = req.params.id || req.body.workshop_id;
    const student_id = req.user.id;

    if (!workshop_id) {
      return res.status(400).json({ message: 'Workshop ID is required.' });
    }

    // 1. Check if workshop exists & has available seats
    const workshopCheck = await query(
      `SELECT 
        w.id, 
        w.title, 
        w.max_seats,
        COUNT(r.id)::int AS registered_count
       FROM workshops w
       LEFT JOIN registrations r ON w.id = r.workshop_id
       WHERE w.id = $1
       GROUP BY w.id`,
      [workshop_id]
    );

    if (workshopCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Workshop not found.' });
    }

    const workshop = workshopCheck.rows[0];

    // Check if workshop is full
    if (workshop.registered_count >= workshop.max_seats) {
      return res.status(400).json({ message: 'This workshop has reached maximum seat capacity.' });
    }

    // 2. Check if student is already registered
    const duplicateCheck = await query(
      'SELECT id FROM registrations WHERE workshop_id = $1 AND student_id = $2',
      [workshop_id, student_id]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(400).json({ message: 'You are already registered for this workshop.' });
    }

    // 3. Create registration
    const result = await query(
      `INSERT INTO registrations (workshop_id, student_id, status)
       VALUES ($1, $2, 'registered')
       RETURNING id, workshop_id, student_id, status, created_at`,
      [workshop_id, student_id]
    );

    return res.status(201).json({
      message: `Successfully registered for "${workshop.title}"!`,
      registration: result.rows[0]
    });
  } catch (error) {
    console.error('registerForWorkshop error:', error);
    if (error.code === '23505') { // unique violation
      return res.status(400).json({ message: 'You are already registered for this workshop.' });
    }
    return res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Get current student's registered workshops
export const getMyRegistrations = async (req, res) => {
  try {
    const student_id = req.user.id;

    const sql = `
      SELECT 
        r.id AS registration_id,
        r.status AS registration_status,
        r.created_at AS registered_at,
        w.id AS workshop_id,
        w.title,
        w.description,
        TO_CHAR(w.date, 'YYYY-MM-DD') AS date,
        w.time,
        w.venue,
        w.instructor,
        w.max_seats,
        a.status AS attendance_status,
        f.id AS feedback_id,
        f.rating AS feedback_rating,
        f.comment AS feedback_comment,
        c.certificate_id,
        c.issued_at AS certificate_issued_at
      FROM registrations r
      JOIN workshops w ON r.workshop_id = w.id
      LEFT JOIN attendance a ON a.workshop_id = w.id AND a.student_id = $1
      LEFT JOIN feedback f ON f.workshop_id = w.id AND f.student_id = $1
      LEFT JOIN certificates c ON c.workshop_id = w.id AND c.student_id = $1
      WHERE r.student_id = $1
      ORDER BY w.date ASC, r.created_at DESC
    `;

    const result = await query(sql, [student_id]);
    return res.json({ registrations: result.rows });
  } catch (error) {
    console.error('getMyRegistrations error:', error);
    return res.status(500).json({ message: 'Server error fetching registrations.' });
  }
};

// Get all registrations for a workshop (Admin)
export const getWorkshopRegistrations = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const sql = `
      SELECT 
        r.id AS registration_id,
        r.status AS registration_status,
        r.created_at AS registered_at,
        u.id AS student_id,
        u.name AS student_name,
        u.email AS student_email,
        a.status AS attendance_status,
        c.certificate_id
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      LEFT JOIN attendance a ON a.workshop_id = r.workshop_id AND a.student_id = u.id
      LEFT JOIN certificates c ON c.workshop_id = r.workshop_id AND c.student_id = u.id
      WHERE r.workshop_id = $1
      ORDER BY r.created_at ASC
    `;

    const result = await query(sql, [workshopId]);
    return res.json({ registrations: result.rows });
  } catch (error) {
    console.error('getWorkshopRegistrations error:', error);
    return res.status(500).json({ message: 'Server error fetching workshop registrations.' });
  }
};

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    const { workshopId } = req.params;
    const student_id = req.user.role === 'admin' && req.body.student_id ? req.body.student_id : req.user.id;

    const result = await query(
      'DELETE FROM registrations WHERE workshop_id = $1 AND student_id = $2 RETURNING id',
      [workshopId, student_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Registration not found.' });
    }

    return res.json({ message: 'Registration cancelled successfully.' });
  } catch (error) {
    console.error('cancelRegistration error:', error);
    return res.status(500).json({ message: 'Server error cancelling registration.' });
  }
};
