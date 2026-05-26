import { Router } from 'express';
import { analyticsController } from './analytics.controller';

const router = Router();

router.get('/departments', analyticsController.getDepartmentSummary);
router.get('/leaves', analyticsController.getLeaveStats);
router.get('/attendance', analyticsController.getAttendanceOverview);
router.get('/payroll', analyticsController.getPayrollSummary);

export default router;
