import { Router } from 'express';
import { payrollController } from './payroll.controller';

const router = Router();

router.get('/slip', payrollController.getSlip);
router.get('/recent', payrollController.getRecent);

export default router;
