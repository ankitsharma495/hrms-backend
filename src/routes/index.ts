import { Router } from 'express';
import employeeRoutes from '../modules/employee/employee.routes';
import leaveRoutes from '../modules/leave/leave.routes';
import attendanceRoutes from '../modules/attendance/attendance.routes';
import payrollRoutes from '../modules/payroll/payroll.routes';
import approvalRoutes from '../modules/approvals/approval.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';

const router = Router();

router.use('/employee', employeeRoutes);
router.use('/leave', leaveRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/payroll', payrollRoutes);
router.use('/approvals', approvalRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
