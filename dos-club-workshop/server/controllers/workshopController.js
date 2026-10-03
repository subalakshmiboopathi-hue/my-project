import { query } from '../db/index.js';

// Get all workshops with dynamic registration counts, availability, ratings, and user status
export const getAllWorkshops = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    const sql = `
      SELECT 
        w.id,
        w.title,
        w.description,
        TO_CHAR(w.date, 'YYYY-MM-DD') as date,
        w.time,
        w.venue,
        w.instructor,
        w.max_seats,
        w.created_at,
        COUNT(DISTINCT r.id)::int AS total_registered,
        GREATEST(w.max_seats - COUNT(DISTINCT r.id)::int, 0) AS available_seats,
        (COUNT(DISTINCT r.id)::int >= w.max_seats) AS is_full,
        COALESCE(ROUND(AVG(f.rating)::numeric, 1), 0) AS average_rating,
        COUNT(DISTINCT f.id)::int AS feedback_count,
        ${userId ? `
          EXISTS(SELECT 1 FROM registrations ur WHERE ur.workshop_id = w.id AND ur.student_id = $1) AS is_registered,
          (SELECT a.status FROM attendance a WHERE a.workshop_id = w.id AND a.student_id = $1) AS attendance_status,
          EXISTS(SELECT 1 FROM feedback uf WHERE uf.workshop_id = w.id AND uf.student_id = $1) AS has_feedback,
          (SELECT c.certificate_id FROM certificates c WHERE c.workshop_id = w.id AND c.student_id = $1) AS certificate_id
        ` : `
          false AS is_registered,
          NULL AS attendance_status,
          false AS has_feedback,
          NULL AS certificate_id
        `}
      FROM workshops w
      LEFT JOIN registrations r ON w.id = r.workshop_id
      LEFT JOIN feedback f ON w.id = f.workshop_id
      GROUP BY w.id
      ORDER BY w.date ASC, w.created_at DESC
    `;

    const params = userId ? [userId] : [];
    const result = await query(sql, params);

    return res.json({ workshops: result.rows });
  } catch (error) {
    console.error('getAllWorkshops error:', error);
    return res.status(500).json({ message: 'Server error fetching workshops.' });
  }
};

// Get single workshop details
export const getWorkshopById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const sql = `
      SELECT 
        w.id,
        w.title,
        w.description,
        TO_CHAR(w.date, 'YYYY-MM-DD') as date,
        w.time,
        w.venue,
        w.instructor,
        w.max_seats,
        w.created_at,
        COUNT(DISTINCT r.id)::int AS total_registered,
        GREATEST(w.max_seats - COUNT(DISTINCT r.id)::int, 0) AS available_seats,
        (COUNT(DISTINCT r.id)::int >= w.max_seats) AS is_full,
        COALESCE(ROUND(AVG(f.rating)::numeric, 1), 0) AS average_rating,
        COUNT(DISTINCT f.id)::int AS feedback_count,
        ${userId ? `
          EXISTS(SELECT 1 FROM registrations ur WHERE ur.workshop_id = w.id AND ur.student_id = $1) AS is_registered,
          (SELECT a.status FROM attendance a WHERE a.workshop_id = w.id AND a.student_id = $1) AS attendance_status,
          EXISTS(SELECT 1 FROM feedback uf WHERE uf.workshop_id = w.id AND uf.student_id = $1) AS has_feedback,
          (SELECT c.certificate_id FROM certificates c WHERE c.workshop_id = w.id AND c.student_id = $1) AS certificate_id
        ` : `
          false AS is_registered,
          NULL AS attendance_status,
          false AS has_feedback,
          NULL AS certificate_id
        `}
      FROM workshops w
      LEFT JOIN registrations r ON w.id = r.workshop_id
      LEFT JOIN feedback f ON w.id = f.workshop_id
      WHERE w.id = ${userId ? '$2' : '$1'}
      GROUP BY w.id
    `;

    const params = userId ? [userId, id] : [id];
    const result = await query(sql, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Workshop not found.' });
    }

    return res.json({ workshop: result.rows[0] });
  } catch (error) {
    console.error('getWorkshopById error:', error);
    return res.status(500).json({ message: 'Server error fetching workshop details.' });
  }
};

// Create workshop (Admin only)
export const createWorkshop = async (req, res) => {
  try {
    const { title, description, date, time, venue, instructor, max_seats } = req.body;

    if (!title || !description || !date || !time || !venue || !instructor || !max_seats) {
      return res.status(400).json({ message: 'All workshop fields are required.' });
    }

    const seats = parseInt(max_seats, 10);
    if (isNaN(seats) || seats <= 0) {
      return res.status(400).json({ message: 'Maximum seats must be a positive integer.' });
    }

    const result = await query(
      `INSERT INTO workshops (title, description, date, time, venue, instructor, max_seats)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, TO_CHAR(date, 'YYYY-MM-DD') as date, time, venue, instructor, max_seats, created_at`,
      [title.trim(), description.trim(), date, time.trim(), venue.trim(), instructor.trim(), seats]
    );

    return res.status(201).json({
      message: 'Workshop created successfully!',
      workshop: result.rows[0]
    });
  } catch (error) {
    console.error('createWorkshop error:', error);
    return res.status(500).json({ message: 'Server error creating workshop.' });
  }
};

// Update workshop (Admin only)
export const updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, time, venue, instructor, max_seats } = req.body;

    if (!title || !description || !date || !time || !venue || !instructor || !max_seats) {
      return res.status(400).json({ message: 'All workshop fields are required.' });
    }

    const seats = parseInt(max_seats, 10);
    if (isNaN(seats) || seats <= 0) {
      return res.status(400).json({ message: 'Maximum seats must be a positive integer.' });
    }

    const result = await query(
      `UPDATE workshops
       SET title = $1, description = $2, date = $3, time = $4, venue = $5, instructor = $6, max_seats = $7
       WHERE id = $8
       RETURNING id, title, description, TO_CHAR(date, 'YYYY-MM-DD') as date, time, venue, instructor, max_seats, created_at`,
      [title.trim(), description.trim(), date, time.trim(), venue.trim(), instructor.trim(), seats, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Workshop not found.' });
    }

    return res.json({
      message: 'Workshop updated successfully!',
      workshop: result.rows[0]
    });
  } catch (error) {
    console.error('updateWorkshop error:', error);
    return res.status(500).json({ message: 'Server error updating workshop.' });
  }
};

// Delete workshop (Admin only)
export const deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('DELETE FROM workshops WHERE id = $1 RETURNING id, title', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Workshop not found.' });
    }

    return res.json({
      message: 'Workshop deleted successfully!',
      deletedId: id,
      title: result.rows[0].title
    });
  } catch (error) {
    console.error('deleteWorkshop error:', error);
    return res.status(500).json({ message: 'Server error deleting workshop.' });
  }
};
