import pool from '../../core/db/postgres';

export const approvalRepository = {
  async getPendingLeaves() {
    const result = await pool.query(
      "SELECT la.id, la.employee_id, la.leave_type, la.from_date, la.to_date, la.duration, la.reason, la.applied_at, e.name as employee_name FROM leave_applications la JOIN employees e ON e.id = la.employee_id WHERE la.status = 'pending' ORDER BY la.applied_at DESC"
    );
    return result.rows;
  },

  async updateLeaveStatus(application_id: number, status: 'approved' | 'rejected') {
    await pool.query(
      'UPDATE leave_applications SET status = $1 WHERE id = $2',
      [status, application_id]
    );
  },

  async getApplicationById(application_id: number) {
    const result = await pool.query(
      'SELECT id, employee_id, leave_type, duration, status FROM leave_applications WHERE id = $1',
      [application_id]
    );
    return result.rows[0] || null;
  },

  async restoreLeaveBalance(employee_id: number, leave_type: string, duration: number) {
    await pool.query(
      'UPDATE leave_balances SET used = used - $1, remaining = remaining + $1 WHERE employee_id = $2 AND leave_type = $3',
      [duration, employee_id, leave_type]
    );
  },
};
