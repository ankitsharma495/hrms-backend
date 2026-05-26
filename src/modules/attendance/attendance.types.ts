export interface AttendanceRecord {
  id: number;
  employee_id: number;
  date: string;
  check_in: string | null;
  check_out: string | null;
  type: 'WFO' | 'WFH' | 'absent';
  is_late: boolean;
  grace_used: boolean;
}

export interface AttendanceSummary {
  total_working_days: number;
  present: number;
  absent: number;
  wfo: number;
  wfh: number;
  late_count: number;
  lop_days: number;
}
