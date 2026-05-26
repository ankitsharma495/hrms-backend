import { Request, Response } from 'express';
import { approvalService } from './approval.service';

export const approvalController = {
  async getPending(req: Request, res: Response) {
    const pending = await approvalService.getPendingLeaves();
    res.json(pending);
  },

  async approve(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await approvalService.approveLeave(Number(id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async reject(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = await approvalService.rejectLeave(Number(id));
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },
};
