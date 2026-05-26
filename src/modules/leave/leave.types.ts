export type LeaveType = 'casual' | 'sick' | 'earned';

export interface LeaveBalance {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveApplication {
  id: number;
  employee_id: number;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}

export interface ApplyLeavePayload {
  employee_id: number;
  leave_type: LeaveType;
  from_date: string;
  to_date: string;
  duration: number;
  reason: string;
}
