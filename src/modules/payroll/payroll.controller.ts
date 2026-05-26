import { Request, Response } from 'express';
import { payrollService } from './payroll.service';

export const payrollController = {
  async getSlip(req: Request, res: Response) {
    const { employee_id, month } = req.query;

    if (!employee_id || !month) {
      res.status(400).json({ error: 'employee_id and month are required' });
      return;
    }

    const slip = await payrollService.getSlip(Number(employee_id), month as string);

    if (!slip) {
      res.status(404).json({ error: 'Salary slip not found' });
      return;
    }

    res.json(slip);
  },

  async getRecent(req: Request, res: Response) {
    const { employee_id, limit } = req.query;

    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }

    const slips = await payrollService.getRecent(Number(employee_id), parseInt(limit as string) || 3);
    res.json(slips);
  },
};
