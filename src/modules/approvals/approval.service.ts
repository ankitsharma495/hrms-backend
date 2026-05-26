import { approvalRepository } from './approval.repository';
import { eventPublisher } from '../../core/events/event.publisher';

export const approvalService = {
  async getPendingLeaves() {
    return approvalRepository.getPendingLeaves();
  },

  async approveLeave(application_id: number) {
    const app = await approvalRepository.getApplicationById(application_id);
    if (!app) throw new Error('Application not found');
    if (app.status !== 'pending') throw new Error('Application is not pending');

    await approvalRepository.updateLeaveStatus(application_id, 'approved');
    eventPublisher.emit('leave.approved', { application_id });
    return { success: true, message: 'Leave approved' };
  },

  async rejectLeave(application_id: number) {
    const app = await approvalRepository.getApplicationById(application_id);
    if (!app) throw new Error('Application not found');
    if (app.status !== 'pending') throw new Error('Application is not pending');

    await approvalRepository.updateLeaveStatus(application_id, 'rejected');
    await approvalRepository.restoreLeaveBalance(app.employee_id, app.leave_type, app.duration);
    eventPublisher.emit('leave.rejected', { application_id });
    return { success: true, message: 'Leave rejected, balance restored' };
  },
};
