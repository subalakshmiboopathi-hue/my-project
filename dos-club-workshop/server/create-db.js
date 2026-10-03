import pg from 'pg';
const { Client } = pg;

async function initDatabase() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
  });

  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'dos_workshop'");
    if (res.rowCount === 0) {
      console.log("Database 'dos_workshop' does not exist. Creating...");
      await client.query('CREATE DATABASE dos_workshop');
      console.log("Database 'dos_workshop' created successfully!");
    } else {
      console.log("Database 'dos_workshop' already exists.");
    }
    await client.end();
  } catch (err) {
    console.error("Error creating database:", err);
  }
}

initDatabase();
