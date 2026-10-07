import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dos_workshop';

const isSSL =
  process.env.DATABASE_SSL === 'true' ||
  connectionString.includes('neon.tech') ||
  connectionString.includes('sslmode=require');

export const pool = new Pool({
  connectionString: connectionString,
  ssl: isSSL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Helper function to query the database
export const query = (text, params) => pool.query(text, params);

// Auto-initialize schema on startup
export const initDB = async () => {
  try {
    const candidatePaths = [
      path.resolve(__dirname, '../../database/schema.sql'),
      path.resolve(__dirname, '../database/schema.sql'),
      path.resolve(process.cwd(), 'database/schema.sql'),
      path.resolve(process.cwd(), '../database/schema.sql'),
      path.resolve(__dirname, './schema.sql')
    ];

    const schemaPath = candidatePaths.find(p => fs.existsSync(p));

    if (schemaPath) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schemaSql);
      console.log('Database tables & schema verified successfully from', schemaPath);
    } else {
      console.warn('Warning: schema.sql file not found in searched paths.');
    }
  } catch (error) {
    console.error('Database schema initialization error:', error);
  }
};
