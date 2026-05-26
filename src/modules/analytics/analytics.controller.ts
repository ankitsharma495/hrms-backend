import { Request, Response } from 'express';
import { analyticsService } from './analytics.service';

export const analyticsController = {
  async getDepartmentSummary(req: Request, res: Response) {
    const data = await analyticsService.getDepartmentSummary();
    res.json(data);
  },

  async getLeaveStats(req: Request, res: Response) {
    const { month } = req.query;
    const data = await analyticsService.getLeaveStats(month as string);
    res.json(data);
  },

  async getAttendanceOverview(req: Request, res: Response) {
    const { month } = req.query;
    if (!month) {
      res.status(400).json({ error: 'month is required (YYYY-MM)' });
      return;
    }
    const data = await analyticsService.getAttendanceOverview(month as string);
    res.json(data);
  },

  async getPayrollSummary(req: Request, res: Response) {
    const { month } = req.query;
    if (!month) {
      res.status(400).json({ error: 'month is required (YYYY-MM)' });
      return;
    }
    const data = await analyticsService.getPayrollSummary(month as string);
    res.json(data);
  },
};
