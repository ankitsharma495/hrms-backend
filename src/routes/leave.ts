import { Router, Request, Response } from 'express';
import pool from '../db/client';

const router = Router();

// GET /api/leave/balance?employee_id={id}
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const { employee_id } = req.query;

    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }

    const result = await pool.query(
      'SELECT leave_type, total, used, remaining FROM leave_balances WHERE employee_id = $1',
      [employee_id]
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// GET /api/leave/applications?employee_id={id}&limit=5
router.get('/applications', async (req: Request, res: Response) => {
  try {
    const { employee_id, limit } = req.query;

    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }

    const limitVal = parseInt(limit as string) || 5;

    const result = await pool.query(
      'SELECT id, leave_type, from_date, to_date, duration, status, applied_at FROM leave_applications WHERE employee_id = $1 ORDER BY applied_at DESC LIMIT $2',
      [employee_id, limitVal]
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// POST /api/leave/apply
router.post('/apply', async (req: Request, res: Response) => {
  try {
    const { employee_id, leave_type, from_date, to_date, duration, reason } = req.body;

    if (!employee_id || !leave_type || !from_date || !to_date || duration == null) {
      res.status(400).json({ error: 'Missing required fields: employee_id, leave_type, from_date, to_date, duration' });
      return;
    }

    // Check remaining balance
    const balanceResult = await pool.query(
      'SELECT remaining FROM leave_balances WHERE employee_id = $1 AND leave_type = $2',
      [employee_id, leave_type]
    );

    if (balanceResult.rows.length === 0) {
      res.status(404).json({ error: 'Leave balance not found for this leave type' });
      return;
    }

    const remaining = parseFloat(balanceResult.rows[0].remaining);

    if (remaining < duration) {
      res.status(400).json({ error: 'Insufficient leave balance', remaining });
      return;
    }

    // Insert leave application
    const insertResult = await pool.query(
      "INSERT INTO leave_applications (employee_id, leave_type, from_date, to_date, duration, reason, status) VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING id",
      [employee_id, leave_type, from_date, to_date, duration, reason]
    );

    // Update leave balance
    await pool.query(
      'UPDATE leave_balances SET used = used + $1, remaining = remaining - $1 WHERE employee_id = $2 AND leave_type = $3',
      [duration, employee_id, leave_type]
    );

    res.json({
      success: true,
      application_id: insertResult.rows[0].id,
      message: 'Leave applied successfully',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

export default router;
