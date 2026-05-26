import { ApplyLeavePayload } from './leave.types';
import { LEAVE_TYPES } from './leave.constants';

export function validateApplyLeave(body: any): string | null {
  const { employee_id, leave_type, from_date, to_date, duration } = body;

  if (!employee_id || !leave_type || !from_date || !to_date || duration == null) {
    return 'Missing required fields: employee_id, leave_type, from_date, to_date, duration';
  }

  if (!LEAVE_TYPES.includes(leave_type)) {
    return `Invalid leave_type. Must be one of: ${LEAVE_TYPES.join(', ')}`;
  }

  if (typeof duration !== 'number' || duration <= 0) {
    return 'Duration must be a positive number';
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(from_date) || !dateRegex.test(to_date)) {
    return 'Dates must be in YYYY-MM-DD format';
  }

  if (from_date > to_date) {
    return 'from_date cannot be after to_date';
  }

  return null;
}
