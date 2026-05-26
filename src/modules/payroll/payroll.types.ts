export interface SalarySlip {
  id: number;
  employee_id: number;
  month: string;
  basic: number;
  hra: number;
  lop_days: number;
  lop_deduction: number;
  net_salary: number;
  generated_at: string;
}
