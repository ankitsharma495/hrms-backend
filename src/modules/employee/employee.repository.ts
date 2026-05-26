import pool from '../../core/db/postgres';

export const employeeRepository = {
  async findByPhone(phone: string) {
    const result = await pool.query(
      'SELECT id, name, email, phone, department, designation, joining_date, monthly_salary FROM employees WHERE phone = $1',
      [phone]
    );
    return result.rows[0] || null;
  },

  async findById(id: number) {
    const result = await pool.query(
      'SELECT id, name, email, phone, department, designation, joining_date, monthly_salary FROM employees WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  },

  async findAll() {
    const result = await pool.query(
      'SELECT id, name, email, phone, department, designation, joining_date FROM employees ORDER BY id'
    );
    return result.rows;
  },

  async create(data: { name: string; email: string; phone: string; department?: string; designation?: string; joining_date?: string; monthly_salary?: number }) {
    const result = await pool.query(
      'INSERT INTO employees (name, email, phone, department, designation, joining_date, monthly_salary) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [data.name, data.email, data.phone, data.department, data.designation, data.joining_date, data.monthly_salary]
    );
    return result.rows[0];
  },
};
