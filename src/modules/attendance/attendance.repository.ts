import pool from '../../core/db/postgres';
import { AttendanceRecord } from './attendance.types';

export const attendanceRepository = {
  async getByMonth(employee_id: number, month: string): Promise<AttendanceRecord[]> {
    const result = await pool.query(
      "SELECT type, is_late FROM attendance WHERE employee_id = $1 AND date LIKE $2",
      [employee_id, `${month}-%`]
    );
    return result.rows;
  },

  async getRecent(employee_id: number, days: number): Promise<AttendanceRecord[]> {
    const result = await pool.query(
      'SELECT date, type, check_in, check_out, is_late FROM attendance WHERE employee_id = $1 ORDER BY date DESC LIMIT $2',
      [employee_id, days]
    );
    return result.rows;
  },

  async markAttendance(data: { employee_id: number; date: string; check_in: string; check_out?: string; type: string; is_late: boolean; grace_used: boolean }) {
    const result = await pool.query(
      'INSERT INTO attendance (employee_id, date, check_in, check_out, type, is_late, grace_used) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [data.employee_id, data.date, data.check_in, data.check_out, data.type, data.is_late, data.grace_used]
    );
    return result.rows[0];
  },
};
