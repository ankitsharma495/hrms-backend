import { Request, Response } from 'express';
import { employeeService } from './employee.service';

export const employeeController = {
  async getByPhone(req: Request, res: Response) {
    const { phone } = req.query;

    if (!phone) {
      res.status(400).json({ error: 'Phone number is required' });
      return;
    }

    const employee = await employeeService.getByPhone(phone as string);

    if (!employee) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }

    res.json(employee);
  },

  async getAll(req: Request, res: Response) {
    const employees = await employeeService.getAll();
    res.json(employees);
  },
};
