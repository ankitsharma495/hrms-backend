import { Request, Response } from 'express';
import { leaveService } from './leave.service';
import { validateApplyLeave } from './leave.validation';

export const leaveController = {
  async getBalance(req: Request, res: Response) {
    const { employee_id } = req.query;
    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }
    const balances = await leaveService.getBalance(Number(employee_id));
    res.json(balances);
  },

  async getApplications(req: Request, res: Response) {
    const { employee_id, limit } = req.query;
    if (!employee_id) {
      res.status(400).json({ error: 'employee_id is required' });
      return;
    }
    const apps = await leaveService.getApplications(Number(employee_id), parseInt(limit as string) || 5);
    res.json(apps);
  },

  async apply(req: Request, res: Response) {
    const validationError = validateApplyLeave(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const result = await leaveService.apply(req.body);
    if ('error' in result) {
      res.status(result.status).json(result);
      return;
    }
    res.json(result);
  },
};
