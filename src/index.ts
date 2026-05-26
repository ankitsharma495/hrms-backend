import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { createSchema } from './db/schema';
import { authMiddleware } from './middlewares/auth';
import employeeRouter from './routes/employee';
import leaveRouter from './routes/leave';
import attendanceRouter from './routes/attendance';
import payrollRouter from './routes/payroll';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use('/api/employee', employeeRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/payroll', payrollRouter);

createSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`HRMS API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to create schema:', err);
    process.exit(1);
  });
