import pool from './client';

export async function createSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      department TEXT,
      designation TEXT,
      joining_date TEXT,
      monthly_salary NUMERIC
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leave_balances (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id),
      leave_type TEXT,
      total INTEGER,
      used INTEGER,
      remaining INTEGER
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leave_applications (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id),
      leave_type TEXT,
      from_date TEXT,
      to_date TEXT,
      duration NUMERIC,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id),
      date TEXT,
      check_in TEXT,
      check_out TEXT,
      type TEXT,
      is_late BOOLEAN,
      grace_used BOOLEAN
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS salary_slips (
      id SERIAL PRIMARY KEY,
      employee_id INTEGER REFERENCES employees(id),
      month TEXT,
      basic NUMERIC,
      hra NUMERIC,
      lop_days INTEGER,
      lop_deduction NUMERIC,
      net_salary NUMERIC,
      generated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log('Schema created successfully');
}

if (require.main === module) {
  createSchema()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Schema creation failed:', err);
      process.exit(1);
    });
}
