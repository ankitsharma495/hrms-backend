import { Router } from 'express';
import { attendanceController } from './attendance.controller';

const router = Router();

router.get('/summary', attendanceController.getSummary);
router.get('/recent', attendanceController.getRecent);

export default router;
