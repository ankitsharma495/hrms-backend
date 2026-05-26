import { Router } from 'express';
import { leaveController } from './leave.controller';

const router = Router();

router.get('/balance', leaveController.getBalance);
router.get('/applications', leaveController.getApplications);
router.post('/apply', leaveController.apply);

export default router;
