import { Router } from 'express';
import { approvalController } from './approval.controller';

const router = Router();

router.get('/pending', approvalController.getPending);
router.post('/:id/approve', approvalController.approve);
router.post('/:id/reject', approvalController.reject);

export default router;
