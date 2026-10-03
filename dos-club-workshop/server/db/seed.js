import bcrypt from 'bcryptjs';
import { query, pool } from './index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabase = async () => {
  try {
    console.log('Seeding DOS Club database...');

    // 1. Ensure Schema
    const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
    }

    // 2. Hash default passwords
    const adminPasswordHash = await bcrypt.hash('cms@2007', 10);
    const studentPasswordHash = await bcrypt.hash('student123', 10);

    // 3. Insert Admin User (with email 'admin' and 'admin@dosclub.org')
    await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE 
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role`,
      ['DOS Admin', 'admin', adminPasswordHash, 'admin']
    );

    const adminRes = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE 
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
       RETURNING id, name, email, role`,
      ['DOS Admin', 'admin@dosclub.org', adminPasswordHash, 'admin']
    );

    // 4. Insert Sample Students
    const student1 = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE 
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
       RETURNING id, name, email, role`,
      ['Alex Johnson', 'student@dosclub.org', studentPasswordHash, 'student']
    );

    const student2 = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE 
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
       RETURNING id, name, email, role`,
      ['Priya Sharma', 'priya@dosclub.org', studentPasswordHash, 'student']
    );

    const student3 = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE 
       SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash, role = EXCLUDED.role
       RETURNING id, name, email, role`,
      ['David Chen', 'david@dosclub.org', studentPasswordHash, 'student']
    );

    const alexId = student1.rows[0].id;
    const priyaId = student2.rows[0].id;
    const davidId = student3.rows[0].id;

    // 5. Insert Sample Workshops
    const workshopsData = [
      {
        title: 'Introduction to Generative AI',
        description: 'Explore state-of-the-art Large Language Models, prompt engineering, diffusion architectures, and hands-on integration into modern web apps.',
        date: '2026-10-15',
        time: '10:00 AM - 01:00 PM',
        venue: 'DOS Innovation Hub - Hall A',
        instructor: 'Dr. Sarah Connor',
        max_seats: 50
      },
      {
        title: 'Git & GitHub Essentials',
        description: 'Master branch workflows, resolving merge conflicts, interactive rebasing, GitHub Actions CI/CD, and open source collaboration best practices.',
        date: '2026-10-18',
        time: '02:00 PM - 05:00 PM',
        venue: 'Computer Lab 3, Tech Tower',
        instructor: 'Marcus Vance',
        max_seats: 30
      },
      {
        title: 'Web Development Fundamentals',
        description: 'Deep dive into full-stack modern JavaScript, responsive Tailwind layouts, RESTful API architecture with Node & Express, and PostgreSQL data modeling.',
        date: '2026-10-22',
        time: '09:30 AM - 12:30 PM',
        venue: 'Seminar Hall 2, Science Block',
        instructor: 'Aarav Patel',
        max_seats: 40
      },
      {
        title: 'Introduction to Data Science',
        description: 'A comprehensive crash course on exploratory data analysis, data visualization, statistical hypothesis testing, and machine learning model pipelines.',
        date: '2026-10-28',
        time: '01:30 PM - 04:30 PM',
        venue: 'Virtual Auditorium & Lab B',
        instructor: 'Elena Rostova',
        max_seats: 35
      }
    ];

    const insertedWorkshops = [];
    for (const w of workshopsData) {
      const existing = await query(`SELECT id FROM workshops WHERE title = $1`, [w.title]);
      let wId;
      if (existing.rows.length > 0) {
        wId = existing.rows[0].id;
        await query(
          `UPDATE workshops SET description = $1, date = $2, time = $3, venue = $4, instructor = $5, max_seats = $6 WHERE id = $7`,
          [w.description, w.date, w.time, w.venue, w.instructor, w.max_seats, wId]
        );
      } else {
        const res = await query(
          `INSERT INTO workshops (title, description, date, time, venue, instructor, max_seats)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [w.title, w.description, w.date, w.time, w.venue, w.instructor, w.max_seats]
        );
        wId = res.rows[0].id;
      }
      insertedWorkshops.push(wId);
    }

    const [w1, w2, w3, w4] = insertedWorkshops;

    // 6. Registrations
    await query(
      `INSERT INTO registrations (workshop_id, student_id, status)
       VALUES ($1, $2, 'registered'), ($3, $4, 'registered'), ($5, $6, 'registered'), ($7, $8, 'registered')
       ON CONFLICT (workshop_id, student_id) DO NOTHING`,
      [w1, alexId, w1, priyaId, w2, alexId, w3, davidId]
    );

    // 7. Attendance (Alex present in W1, Priya absent in W1)
    await query(
      `INSERT INTO attendance (workshop_id, student_id, status)
       VALUES ($1, $2, 'present'), ($3, $4, 'absent')
       ON CONFLICT (workshop_id, student_id) DO UPDATE SET status = EXCLUDED.status`,
      [w1, alexId, w1, priyaId]
    );

    // 8. Feedback
    await query(
      `INSERT INTO feedback (workshop_id, student_id, rating, comment)
       VALUES ($1, $2, 5, 'Incredible workshop! The hands-on LLM demos and practical code examples were brilliant.')
       ON CONFLICT (workshop_id, student_id) DO UPDATE SET rating = EXCLUDED.rating, comment = EXCLUDED.comment`,
      [w1, alexId]
    );

    // 9. Certificate for Alex (since present in W1)
    await query(
      `INSERT INTO certificates (workshop_id, student_id, certificate_id, issued_at)
       VALUES ($1, $2, 'DOS-2026-AI-8921', CURRENT_TIMESTAMP)
       ON CONFLICT (workshop_id, student_id) DO NOTHING`,
      [w1, alexId]
    );

    console.log('Database seeded successfully!');
    console.log('----------------------------------------------------');
    console.log('Default Credentials:');
    console.log('Admin:   admin (or admin@dosclub.org) / cms@2007');
    console.log('Student: student@dosclub.org / student123');
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => {
    pool.end();
  });
}
