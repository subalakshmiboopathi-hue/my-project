import { query } from '../db/index.js';

// Submit feedback (Student)
export const submitFeedback = async (req, res) => {
  try {
    const workshop_id = req.params.id || req.body.workshop_id;
    const { rating, comment } = req.body;
    const student_id = req.user.id;

    if (!workshop_id || rating === undefined) {
      return res.status(400).json({ message: 'Workshop ID and rating (1-5) are required.' });
    }

    const numRating = parseInt(rating, 10);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5.' });
    }

    // Check if student is registered for the workshop
    const regCheck = await query(
      'SELECT id FROM registrations WHERE workshop_id = $1 AND student_id = $2',
      [workshop_id, student_id]
    );

    if (regCheck.rows.length === 0) {
      return res.status(403).json({ message: 'You must be registered for this workshop to submit feedback.' });
    }

    // Insert or update feedback
    const sql = `
      INSERT INTO feedback (workshop_id, student_id, rating, comment, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (workshop_id, student_id)
      DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment, created_at = CURRENT_TIMESTAMP
      RETURNING id, workshop_id, student_id, rating, comment, created_at
    `;

    const result = await query(sql, [workshop_id, student_id, numRating, comment ? comment.trim() : '']);

    return res.status(201).json({
      message: 'Feedback submitted successfully! Thank you.',
      feedback: result.rows[0]
    });
  } catch (error) {
    console.error('submitFeedback error:', error);
    return res.status(500).json({ message: 'Server error submitting feedback.' });
  }
};

// Get feedback for a specific workshop
export const getWorkshopFeedback = async (req, res) => {
  try {
    const { workshopId } = req.params;

    // Get summary statistics
    const statsSql = `
      SELECT 
        COUNT(f.id)::int AS total_reviews,
        COALESCE(ROUND(AVG(f.rating)::numeric, 1), 0) AS average_rating,
        COUNT(CASE WHEN f.rating = 5 THEN 1 END)::int AS star_5,
        COUNT(CASE WHEN f.rating = 4 THEN 1 END)::int AS star_4,
        COUNT(CASE WHEN f.rating = 3 THEN 1 END)::int AS star_3,
        COUNT(CASE WHEN f.rating = 2 THEN 1 END)::int AS star_2,
        COUNT(CASE WHEN f.rating = 1 THEN 1 END)::int AS star_1
      FROM feedback f
      WHERE f.workshop_id = $1
    `;

    // Get individual feedback list
    const listSql = `
      SELECT 
        f.id,
        f.rating,
        f.comment,
        f.created_at,
        u.name AS student_name,
        u.email AS student_email
      FROM feedback f
      JOIN users u ON f.student_id = u.id
      WHERE f.workshop_id = $1
      ORDER BY f.created_at DESC
    `;

    const [statsResult, listResult] = await Promise.all([
      query(statsSql, [workshopId]),
      query(listSql, [workshopId])
    ]);

    return res.json({
      summary: statsResult.rows[0],
      feedbacks: listResult.rows
    });
  } catch (error) {
    console.error('getWorkshopFeedback error:', error);
    return res.status(500).json({ message: 'Server error fetching feedback.' });
  }
};

// Get all feedbacks across workshops (Admin view)
export const getAllFeedback = async (req, res) => {
  try {
    const sql = `
      SELECT 
        f.id,
        f.rating,
        f.comment,
        f.created_at,
        u.name AS student_name,
        u.email AS student_email,
        w.id AS workshop_id,
        w.title AS workshop_title
      FROM feedback f
      JOIN users u ON f.student_id = u.id
      JOIN workshops w ON f.workshop_id = w.id
      ORDER BY f.created_at DESC
    `;

    const result = await query(sql);
    return res.json({ feedbacks: result.rows });
  } catch (error) {
    console.error('getAllFeedback error:', error);
    return res.status(500).json({ message: 'Server error fetching all feedbacks.' });
  }
};
