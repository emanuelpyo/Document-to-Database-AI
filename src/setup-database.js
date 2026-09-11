import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

async function setupDatabase() {
  const client = await pool.connect();

  try {
    console.log("PostgreSQL connected");

    await client.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        department VARCHAR(100),
        salary NUMERIC(12, 2)
      );
    `);

    console.log("Table employees berhasil dibuat");

    await client.query(`
      INSERT INTO employees (name, email, department, salary)
      VALUES
        ('Andi', 'andi@majujaya.com', 'IT', 8000000),
        ('Budi', 'budi@majujaya.com', 'Finance', 7500000),
        ('Citra', 'citra@majujaya.com', 'IT', 9000000)
      ON CONFLICT (email) DO NOTHING;
    `);

    console.log("Data employees berhasil dimasukkan");
  } finally {
    client.release();
    await pool.end();
  }
}

setupDatabase().catch((error) => {
  console.error("Database setup error:");
  console.error(error);
});