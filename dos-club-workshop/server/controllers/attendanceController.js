import { query } from '../db/index.js';

// Get attendance list for a workshop (Admin)
export const getWorkshopAttendance = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const sql = `
      SELECT 
        u.id AS student_id,
        u.name AS student_name,
        u.email AS student_email,
        r.created_at AS registered_at,
        a.id AS attendance_id,
        COALESCE(a.status, 'unmarked') AS status,
        a.created_at AS marked_at,
        c.certificate_id
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      LEFT JOIN attendance a ON a.workshop_id = r.workshop_id AND a.student_id = u.id
      LEFT JOIN certificates c ON c.workshop_id = r.workshop_id AND c.student_id = u.id
      WHERE r.workshop_id = $1
      ORDER BY u.name ASC
    `;

    const result = await query(sql, [workshopId]);
    return res.json({ attendance: result.rows });
  } catch (error) {
    console.error('getWorkshopAttendance error:', error);
    return res.status(500).json({ message: 'Server error fetching workshop attendance.' });
  }
};

// Mark attendance (Admin)
export const markAttendance = async (req, res) => {
  try {
    const workshop_id = req.params.id || req.body.workshop_id;
    const { student_id, status } = req.body;

    if (!workshop_id || !student_id || !status) {
      return res.status(400).json({ message: 'Workshop ID, Student ID, and status are required.' });
    }

    if (!['present', 'absent'].includes(status)) {
      return res.status(400).json({ message: 'Status must be either "present" or "absent".' });
    }

    // Upsert attendance
    const sql = `
      INSERT INTO attendance (workshop_id, student_id, status, created_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (workshop_id, student_id)
      DO UPDATE SET status = EXCLUDED.status, created_at = CURRENT_TIMESTAMP
      RETURNING id, workshop_id, student_id, status, created_at
    `;

    const result = await query(sql, [workshop_id, student_id, status]);

    return res.json({
      message: `Attendance updated to ${status}!`,
      attendance: result.rows[0]
    });
  } catch (error) {
    console.error('markAttendance error:', error);
    return res.status(500).json({ message: 'Server error marking attendance.' });
  }
};

// Get current student's attendance records
export const getMyAttendance = async (req, res) => {
  try {
    const student_id = req.user.id;

    const sql = `
      SELECT 
        w.id AS workshop_id,
        w.title,
        TO_CHAR(w.date, 'YYYY-MM-DD') AS date,
        w.time,
        w.venue,
        w.instructor,
        COALESCE(a.status, 'unmarked') AS status,
        a.created_at AS marked_at,
        c.certificate_id
      FROM registrations r
      JOIN workshops w ON r.workshop_id = w.id
      LEFT JOIN attendance a ON a.workshop_id = w.id AND a.student_id = $1
      LEFT JOIN certificates c ON c.workshop_id = w.id AND c.student_id = $1
      WHERE r.student_id = $1
      ORDER BY w.date DESC
    `;

    const result = await query(sql, [student_id]);
    return res.json({ attendance: result.rows });
  } catch (error) {
    console.error('getMyAttendance error:', error);
    return res.status(500).json({ message: 'Server error fetching your attendance.' });
  }
};
