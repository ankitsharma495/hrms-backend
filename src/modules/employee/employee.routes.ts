import { Router } from 'express';
import { employeeController } from './employee.controller';

const router = Router();

router.get('/me', employeeController.getByPhone);
router.get('/', employeeController.getAll);

export default router;
