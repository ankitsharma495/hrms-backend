import { payrollRepository } from './payroll.repository';

export const payrollService = {
  async getSlip(employee_id: number, month: string) {
    return payrollRepository.getSlip(employee_id, month);
  },

  async getRecent(employee_id: number, limit: number) {
    return payrollRepository.getRecent(employee_id, limit);
  },

  async generate(data: { employee_id: number; month: string; basic: number; hra: number; lop_days: number; lop_deduction: number; net_salary: number }) {
    return payrollRepository.generate(data);
  },
};
