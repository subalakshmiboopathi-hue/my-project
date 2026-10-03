-- =======================================================
-- DOS Club Workshop Management System - Seed Data
-- =======================================================

-- 1. Insert Default Users (Passwords: admin123 & student123 hashed with bcrypt)
-- admin@dosclub.org / admin123
-- student@dosclub.org / student123
INSERT INTO users (name, email, password_hash, role)
VALUES 
  ('DOS Admin', 'admin@dosclub.org', '$2a$10$Qj2UoWzV4F4Xj31g7w3Pue54jQjC1W/3bE7hE4c9H9A1W3Xk5t8iK', 'admin'),
  ('Alex Johnson', 'student@dosclub.org', '$2a$10$6wFq9h2fF1/b9mZ1sWz7/eYwV1B3qV6nC4hT8dE5fG7hI9jK0lM2.', 'student'),
  ('Priya Sharma', 'priya@dosclub.org', '$2a$10$6wFq9h2fF1/b9mZ1sWz7/eYwV1B3qV6nC4hT8dE5fG7hI9jK0lM2.', 'student'),
  ('David Chen', 'david@dosclub.org', '$2a$10$6wFq9h2fF1/b9mZ1sWz7/eYwV1B3qV6nC4hT8dE5fG7hI9jK0lM2.', 'student')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Sample Workshops
INSERT INTO workshops (title, description, date, time, venue, instructor, max_seats)
VALUES 
  (
    'Introduction to Generative AI',
    'Explore state-of-the-art Large Language Models, prompt engineering, diffusion architectures, and hands-on integration into modern web apps.',
    '2026-10-15',
    '10:00 AM - 01:00 PM',
    'DOS Innovation Hub - Hall A',
    'Dr. Sarah Connor',
    50
  ),
  (
    'Git & GitHub Essentials',
    'Master branch workflows, resolving merge conflicts, interactive rebasing, GitHub Actions CI/CD, and open source collaboration best practices.',
    '2026-10-18',
    '02:00 PM - 05:00 PM',
    'Computer Lab 3, Tech Tower',
    'Marcus Vance',
    30
  ),
  (
    'Web Development Fundamentals',
    'Deep dive into full-stack modern JavaScript, responsive Tailwind layouts, RESTful API architecture with Node & Express, and PostgreSQL data modeling.',
    '2026-10-22',
    '09:30 AM - 12:30 PM',
    'Seminar Hall 2, Science Block',
    'Aarav Patel',
    40
  ),
  (
    'Introduction to Data Science',
    'A comprehensive crash course on exploratory data analysis, data visualization, statistical hypothesis testing, and machine learning model pipelines.',
    '2026-10-28',
    '01:30 PM - 04:30 PM',
    'Virtual Auditorium & Lab B',
    'Elena Rostova',
    35
  )
ON CONFLICT DO NOTHING;
