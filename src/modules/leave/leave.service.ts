import { leaveRepository } from './leave.repository';
import { ApplyLeavePayload } from './leave.types';
import { eventPublisher } from '../../core/events/event.publisher';

export const leaveService = {
  async getBalance(employee_id: number) {
    return leaveRepository.getBalances(employee_id);
  },

  async getApplications(employee_id: number, limit: number) {
    return leaveRepository.getApplications(employee_id, limit);
  },

  async apply(payload: ApplyLeavePayload): Promise<{ error: string; status: number; remaining?: number } | { success: true; application_id: number; message: string }> {
    const balance = await leaveRepository.getBalanceByType(payload.employee_id, payload.leave_type);

    if (!balance) {
      return { error: 'Leave balance not found for this leave type', status: 404 };
    }

    if (balance.remaining < payload.duration) {
      return { error: 'Insufficient leave balance', remaining: balance.remaining, status: 400 };
    }

    const applicationId = await leaveRepository.createApplication(payload);
    await leaveRepository.deductBalance(payload.employee_id, payload.leave_type, payload.duration);

    eventPublisher.emit('leave.applied', { applicationId, ...payload });

    return { success: true, application_id: applicationId, message: 'Leave applied successfully' };
  },

  async getPendingApprovals() {
    return leaveRepository.getPendingApplications();
  },

  async approve(application_id: number) {
    await leaveRepository.updateStatus(application_id, 'approved');
    eventPublisher.emit('leave.approved', { application_id });
  },

  async reject(application_id: number, employee_id: number, leave_type: string, duration: number) {
    await leaveRepository.updateStatus(application_id, 'rejected');
    await leaveRepository.restoreBalance(employee_id, leave_type, duration);
    eventPublisher.emit('leave.rejected', { application_id });
  },
};
