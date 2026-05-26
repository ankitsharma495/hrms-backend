import { Router, Request, Response } from 'express';
import pool from '../db/client';

const router = Router();

// GET /api/payroll/slip?employee_id={id}&month={YYYY-MM}
router.get('/slip', async (req: Request, res: Response) => {
  try {
    const { employee_id, month } = req.query;

    if (!employee_id || !month) {
      res.status(400).json({ error: 'employee_id and month are required' });
      return;
    }

    const result = await pool.query(
      'SELECT month, basic, hra, lop_days, lop_deduction, net_salary, generated_at FROM salary_slips WHERE employee_id = $1 AND month = $2',
      [employee_id, month]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Salary slip not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// GET /api/payroll/recent?employee_id={id}&limit=3
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const { employee_id, limit } = req.query;

    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }

    const limitVal = parseInt(limit as string) || 3;

    const result = await pool.query(
      'SELECT month, net_salary, lop_days FROM salary_slips WHERE employee_id = $1 ORDER BY month DESC LIMIT $2',
      [employee_id, limitVal]
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

export default router;
