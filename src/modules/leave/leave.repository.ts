import pool from '../../core/db/postgres';
import { ApplyLeavePayload, LeaveBalance, LeaveApplication } from './leave.types';

export const leaveRepository = {
  async getBalances(employee_id: number): Promise<LeaveBalance[]> {
    const result = await pool.query(
      'SELECT leave_type, total, used, remaining FROM leave_balances WHERE employee_id = $1',
      [employee_id]
    );
    return result.rows;
  },

  async getBalanceByType(employee_id: number, leave_type: string): Promise<LeaveBalance | null> {
    const result = await pool.query(
      'SELECT remaining FROM leave_balances WHERE employee_id = $1 AND leave_type = $2',
      [employee_id, leave_type]
    );
    return result.rows[0] || null;
  },

  async getApplications(employee_id: number, limit: number): Promise<LeaveApplication[]> {
    const result = await pool.query(
      'SELECT id, leave_type, from_date, to_date, duration, reason, status, applied_at FROM leave_applications WHERE employee_id = $1 ORDER BY applied_at DESC LIMIT $2',
      [employee_id, limit]
    );
    return result.rows;
  },

  async createApplication(payload: ApplyLeavePayload): Promise<number> {
    const result = await pool.query(
      "INSERT INTO leave_applications (employee_id, leave_type, from_date, to_date, duration, reason, status) VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING id",
      [payload.employee_id, payload.leave_type, payload.from_date, payload.to_date, payload.duration, payload.reason]
    );
    return result.rows[0].id;
  },

  async deductBalance(employee_id: number, leave_type: string, duration: number) {
    await pool.query(
      'UPDATE leave_balances SET used = used + $1, remaining = remaining - $1 WHERE employee_id = $2 AND leave_type = $3',
      [duration, employee_id, leave_type]
    );
  },

  async getPendingApplications(): Promise<LeaveApplication[]> {
    const result = await pool.query(
      "SELECT la.*, e.name as employee_name FROM leave_applications la JOIN employees e ON e.id = la.employee_id WHERE la.status = 'pending' ORDER BY la.applied_at DESC"
    );
    return result.rows;
  },

  async updateStatus(application_id: number, status: 'approved' | 'rejected') {
    await pool.query(
      'UPDATE leave_applications SET status = $1 WHERE id = $2',
      [status, application_id]
    );
  },

  async restoreBalance(employee_id: number, leave_type: string, duration: number) {
    await pool.query(
      'UPDATE leave_balances SET used = used - $1, remaining = remaining + $1 WHERE employee_id = $2 AND leave_type = $3',
      [duration, employee_id, leave_type]
    );
  },
};
