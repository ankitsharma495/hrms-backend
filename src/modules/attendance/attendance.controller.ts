import { Request, Response } from 'express';
import { attendanceService } from './attendance.service';
import { validateSummaryQuery, validateRecentQuery } from './attendance.validation';

export const attendanceController = {
  async getSummary(req: Request, res: Response) {
    const error = validateSummaryQuery(req.query);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const { employee_id, month } = req.query;
    const summary = await attendanceService.getSummary(Number(employee_id), month as string);
    res.json(summary);
  },

  async getRecent(req: Request, res: Response) {
    const error = validateRecentQuery(req.query);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    const { employee_id, days } = req.query;
    const records = await attendanceService.getRecent(Number(employee_id), parseInt(days as string) || 7);
    res.json(records);
  },
};
