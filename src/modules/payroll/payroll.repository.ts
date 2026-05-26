import pool from '../../core/db/postgres';
import { SalarySlip } from './payroll.types';

export const payrollRepository = {
  async getSlip(employee_id: number, month: string): Promise<SalarySlip | null> {
    const result = await pool.query(
      'SELECT month, basic, hra, lop_days, lop_deduction, net_salary, generated_at FROM salary_slips WHERE employee_id = $1 AND month = $2',
      [employee_id, month]
    );
    return result.rows[0] || null;
  },

  async getRecent(employee_id: number, limit: number): Promise<SalarySlip[]> {
    const result = await pool.query(
      'SELECT month, net_salary, lop_days FROM salary_slips WHERE employee_id = $1 ORDER BY month DESC LIMIT $2',
      [employee_id, limit]
    );
    return result.rows;
  },

  async generate(data: { employee_id: number; month: string; basic: number; hra: number; lop_days: number; lop_deduction: number; net_salary: number }) {
    const result = await pool.query(
      'INSERT INTO salary_slips (employee_id, month, basic, hra, lop_days, lop_deduction, net_salary) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [data.employee_id, data.month, data.basic, data.hra, data.lop_days, data.lop_deduction, data.net_salary]
    );
    return result.rows[0];
  },
};
