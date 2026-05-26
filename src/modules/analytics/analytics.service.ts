import pool from '../../core/db/postgres';

export const analyticsService = {
  async getDepartmentSummary() {
    const result = await pool.query(`
      SELECT department, COUNT(*) as employee_count
      FROM employees
      GROUP BY department
      ORDER BY employee_count DESC
    `);
    return result.rows;
  },

  async getLeaveStats(month?: string) {
    const whereClause = month ? "WHERE la.from_date LIKE $1" : '';
    const params = month ? [`${month}-%`] : [];

    const result = await pool.query(`
      SELECT la.leave_type, la.status, COUNT(*) as count
      FROM leave_applications la
      ${whereClause}
      GROUP BY la.leave_type, la.status
      ORDER BY la.leave_type
    `, params);
    return result.rows;
  },

  async getAttendanceOverview(month: string) {
    const result = await pool.query(`
      SELECT
        e.department,
        COUNT(CASE WHEN a.type != 'absent' THEN 1 END) as present_days,
        COUNT(CASE WHEN a.type = 'absent' THEN 1 END) as absent_days,
        COUNT(CASE WHEN a.is_late = true THEN 1 END) as late_count,
        COUNT(DISTINCT a.employee_id) as employee_count
      FROM attendance a
      JOIN employees e ON e.id = a.employee_id
      WHERE a.date LIKE $1
      GROUP BY e.department
    `, [`${month}-%`]);
    return result.rows;
  },

  async getPayrollSummary(month: string) {
    const result = await pool.query(`
      SELECT
        COUNT(*) as total_slips,
        SUM(net_salary) as total_payout,
        SUM(lop_deduction) as total_lop_deduction,
        AVG(net_salary) as avg_salary
      FROM salary_slips
      WHERE month = $1
    `, [month]);
    return result.rows[0];
  },
};
