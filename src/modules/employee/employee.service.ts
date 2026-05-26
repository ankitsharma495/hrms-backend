import { employeeRepository } from './employee.repository';

export const employeeService = {
  async getByPhone(phone: string) {
    return employeeRepository.findByPhone(phone);
  },

  async getById(id: number) {
    return employeeRepository.findById(id);
  },

  async getAll() {
    return employeeRepository.findAll();
  },

  async create(data: { name: string; email: string; phone: string; department?: string; designation?: string; joining_date?: string; monthly_salary?: number }) {
    return employeeRepository.create(data);
  },
};
