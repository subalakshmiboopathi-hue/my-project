import { query } from '../db/index.js';

// Get Admin Dashboard Overview Statistics
export const getAdminStats = async (req, res) => {
  try {
    const statsSql = `
      SELECT 
        (SELECT COUNT(*)::int FROM workshops) AS total_workshops,
        (SELECT COUNT(*)::int FROM users WHERE role = 'student') AS total_students,
        (SELECT COUNT(*)::int FROM registrations) AS total_registrations,
        (SELECT COUNT(*)::int FROM certificates) AS certificates_issued,
        (SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0) FROM feedback) AS average_rating,
        (SELECT COUNT(*)::int FROM attendance WHERE status = 'present') AS total_present,
        (SELECT COUNT(*)::int FROM attendance WHERE status = 'absent') AS total_absent
    `;

    const recentWorkshopsSql = `
      SELECT 
        w.id,
        w.title,
        TO_CHAR(w.date, 'YYYY-MM-DD') as date,
        w.time,
        w.venue,
        w.instructor,
        w.max_seats,
        COUNT(DISTINCT r.id)::int AS registered_count,
        COALESCE(ROUND(AVG(f.rating)::numeric, 1), 0) AS average_rating
      FROM workshops w
      LEFT JOIN registrations r ON w.id = r.workshop_id
      LEFT JOIN feedback f ON w.id = f.workshop_id
      GROUP BY w.id
      ORDER BY w.date DESC
      LIMIT 5
    `;

    const recentRegistrationsSql = `
      SELECT 
        r.id,
        r.created_at,
        u.name AS student_name,
        u.email AS student_email,
        w.title AS workshop_title
      FROM registrations r
      JOIN users u ON r.student_id = u.id
      JOIN workshops w ON r.workshop_id = w.id
      ORDER BY r.created_at DESC
      LIMIT 6
    `;

    const [statsRes, workshopsRes, registrationsRes] = await Promise.all([
      query(statsSql),
      query(recentWorkshopsSql),
      query(recentRegistrationsSql)
    ]);

    return res.json({
      stats: statsRes.rows[0],
      recentWorkshops: workshopsRes.rows,
      recentRegistrations: registrationsRes.rows
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ message: 'Server error fetching admin statistics.' });
  }
};

// Get Student Dashboard Stats
export const getStudentStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    const statsSql = `
      SELECT 
        (SELECT COUNT(*)::int FROM registrations WHERE student_id = $1) AS registered_count,
        (SELECT COUNT(*)::int FROM attendance WHERE student_id = $1 AND status = 'present') AS attended_count,
        (SELECT COUNT(*)::int FROM certificates WHERE student_id = $1) AS certificates_count,
        (SELECT COUNT(*)::int FROM feedback WHERE student_id = $1) AS feedback_count
    `;

    const nextWorkshopSql = `
      SELECT 
        w.id,
        w.title,
        w.description,
        TO_CHAR(w.date, 'YYYY-MM-DD') as date,
        w.time,
        w.venue,
        w.instructor
      FROM registrations r
      JOIN workshops w ON r.workshop_id = w.id
      WHERE r.student_id = $1 AND w.date >= CURRENT_DATE
      ORDER BY w.date ASC
      LIMIT 1
    `;

    const [statsRes, nextWorkshopRes] = await Promise.all([
      query(statsSql, [studentId]),
      query(nextWorkshopSql, [studentId])
    ]);

    return res.json({
      stats: statsRes.rows[0],
      nextWorkshop: nextWorkshopRes.rows[0] || null
    });
  } catch (error) {
    console.error('getStudentStats error:', error);
    return res.status(500).json({ message: 'Server error fetching student stats.' });
  }
};
