import { Router, Request, Response } from 'express';
import pool from '../db/client';

const router = Router();

// GET /api/employee/me?phone={phone}
router.get('/me', async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      res.status(400).json({ error: 'Phone number is required' });
      return;
    }

    const result = await pool.query(
      'SELECT id, name, department, designation, joining_date FROM employees WHERE phone = $1',
      [phone]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

export default router;
