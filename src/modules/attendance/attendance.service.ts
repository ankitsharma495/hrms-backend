import { attendanceRepository } from './attendance.repository';
import { AttendanceSummary } from './attendance.types';

export const attendanceService = {
  async getSummary(employee_id: number, month: string): Promise<AttendanceSummary> {
    const rows = await attendanceRepository.getByMonth(employee_id, month);

    const total_working_days = rows.length;
    const present = rows.filter((r) => r.type !== 'absent').length;
    const absent = rows.filter((r) => r.type === 'absent').length;
    const wfo = rows.filter((r) => r.type === 'WFO').length;
    const wfh = rows.filter((r) => r.type === 'WFH').length;
    const late_count = rows.filter((r) => r.is_late === true).length;

    return { total_working_days, present, absent, wfo, wfh, late_count, lop_days: absent };
  },

  async getRecent(employee_id: number, days: number) {
    return attendanceRepository.getRecent(employee_id, days);
  },
};
