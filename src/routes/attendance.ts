import { Router, Request, Response } from 'express';
import pool from '../db/client';

const router = Router();

// GET /api/attendance/summary?employee_id={id}&month={YYYY-MM}
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { employee_id, month } = req.query;

    if (!employee_id || !month) {
      res.status(400).json({ error: 'employee_id and month are required' });
      return;
    }

    const result = await pool.query(
      "SELECT type, is_late FROM attendance WHERE employee_id = $1 AND date LIKE $2",
      [employee_id, `${month}-%`]
    );

    const rows = result.rows;
    const total_working_days = rows.length;
    const present = rows.filter((r: any) => r.type !== 'absent').length;
    const absent = rows.filter((r: any) => r.type === 'absent').length;
    const wfo = rows.filter((r: any) => r.type === 'WFO').length;
    const wfh = rows.filter((r: any) => r.type === 'WFH').length;
    const late_count = rows.filter((r: any) => r.is_late === true).length;

    res.json({
      total_working_days,
      present,
      absent,
      wfo,
      wfh,
      late_count,
      lop_days: absent,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// GET /api/attendance/recent?employee_id={id}&days=7
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const { employee_id, days } = req.query;

    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }

    const daysVal = parseInt(days as string) || 7;

    const result = await pool.query(
      'SELECT date, type, check_in, check_out, is_late FROM attendance WHERE employee_id = $1 ORDER BY date DESC LIMIT $2',
      [employee_id, daysVal]
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

export default router;
