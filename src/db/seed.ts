import pool from './client';
import { createSchema } from './schema';

async function seed() {
  await createSchema();

  // Clear tables in FK-safe order
  await pool.query('DELETE FROM salary_slips');
  await pool.query('DELETE FROM attendance');
  await pool.query('DELETE FROM leave_applications');
  await pool.query('DELETE FROM leave_balances');
  await pool.query('DELETE FROM employees');

  // Insert employees
  const employees = [
    { name: 'Rahul Sharma', email: 'rahul@company.com', phone: '+919876543210', department: 'Engineering', designation: 'Backend Engineer', joining_date: '2023-01-15', monthly_salary: 60000 },
    { name: 'Priya Mehta', email: 'priya@company.com', phone: '+919876543211', department: 'HR', designation: 'HR Executive', joining_date: '2022-06-01', monthly_salary: 45000 },
    { name: 'Amit Verma', email: 'amit@company.com', phone: '+919876543212', department: 'Sales', designation: 'Sales Manager', joining_date: '2021-11-20', monthly_salary: 75000 },
    { name: 'Neha Gupta', email: 'neha@company.com', phone: '+919876543213', department: 'Engineering', designation: 'Frontend Engineer', joining_date: '2023-03-10', monthly_salary: 55000 },
    { name: 'Rohan Das', email: 'rohan@company.com', phone: '+919876543214', department: 'Finance', designation: 'Accountant', joining_date: '2022-09-05', monthly_salary: 50000 },
  ];

  const employeeIds: number[] = [];
  for (const emp of employees) {
    const result = await pool.query(
      'INSERT INTO employees (name, email, phone, department, designation, joining_date, monthly_salary) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [emp.name, emp.email, emp.phone, emp.department, emp.designation, emp.joining_date, emp.monthly_salary]
    );
    employeeIds.push(result.rows[0].id);
  }
  console.log('Employees inserted:', employeeIds);

  // Leave balances
  const leaveData = [
    { casual_used: 4, sick_used: 1, earned_used: 5 },
    { casual_used: 2, sick_used: 3, earned_used: 3 },
    { casual_used: 6, sick_used: 0, earned_used: 8 },
    { casual_used: 3, sick_used: 2, earned_used: 4 },
    { casual_used: 5, sick_used: 1, earned_used: 6 },
  ];

  for (let i = 0; i < employeeIds.length; i++) {
    const empId = employeeIds[i];
    const ld = leaveData[i];

    await pool.query(
      'INSERT INTO leave_balances (employee_id, leave_type, total, used, remaining) VALUES ($1,$2,$3,$4,$5)',
      [empId, 'casual', 12, ld.casual_used, 12 - ld.casual_used]
    );
    await pool.query(
      'INSERT INTO leave_balances (employee_id, leave_type, total, used, remaining) VALUES ($1,$2,$3,$4,$5)',
      [empId, 'sick', 8, ld.sick_used, 8 - ld.sick_used]
    );
    await pool.query(
      'INSERT INTO leave_balances (employee_id, leave_type, total, used, remaining) VALUES ($1,$2,$3,$4,$5)',
      [empId, 'earned', 15, ld.earned_used, 15 - ld.earned_used]
    );
  }
  console.log('Leave balances inserted');

  // Attendance - last 30 days
  const today = new Date();
  for (let i = 0; i < employeeIds.length; i++) {
    const empId = employeeIds[i];
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() - d);
      const dayOfWeek = date.getDay();
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;

      const dateStr = date.toISOString().split('T')[0];

      let type: string;
      let checkIn: string | null;
      let checkOut: string | null;
      let isLate = false;
      let graceUsed = false;

      if (d % 8 === 3 || d % 10 === 7 || d % 12 === 9 || d % 15 === 11) {
        // Absent days (~4 per month)
        type = 'absent';
        checkIn = null;
        checkOut = null;
      } else if (d % 5 === 2 || d % 7 === 4) {
        // WFH days (~6 per month)
        type = 'WFH';
        checkIn = '09:15';
        checkOut = '18:30';
      } else if (d % 9 === 1 || d % 11 === 5 || d % 13 === 0) {
        // Late days (~3 per month)
        type = 'WFO';
        checkIn = d % 2 === 0 ? '09:45' : '10:00';
        checkOut = '18:30';
        isLate = true;
        graceUsed = d % 3 === 0;
      } else {
        // Normal WFO
        type = 'WFO';
        checkIn = d % 2 === 0 ? '09:00' : '09:15';
        checkOut = '18:30';
      }

      await pool.query(
        'INSERT INTO attendance (employee_id, date, check_in, check_out, type, is_late, grace_used) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [empId, dateStr, checkIn, checkOut, type, isLate, graceUsed]
      );
    }
  }
  console.log('Attendance inserted');

  // Leave applications (a few per employee)
  const leaveApps = [
    { empIdx: 0, leave_type: 'casual', from_date: '2025-04-10', to_date: '2025-04-11', duration: 2, reason: 'Family function', status: 'approved' },
    { empIdx: 0, leave_type: 'sick', from_date: '2025-05-05', to_date: '2025-05-05', duration: 1, reason: 'Fever', status: 'approved' },
    { empIdx: 1, leave_type: 'casual', from_date: '2025-04-15', to_date: '2025-04-15', duration: 1, reason: 'Personal work', status: 'approved' },
    { empIdx: 1, leave_type: 'earned', from_date: '2025-05-20', to_date: '2025-05-22', duration: 3, reason: 'Vacation', status: 'pending' },
    { empIdx: 2, leave_type: 'casual', from_date: '2025-03-20', to_date: '2025-03-25', duration: 4, reason: 'Travel', status: 'approved' },
    { empIdx: 2, leave_type: 'sick', from_date: '2025-05-01', to_date: '2025-05-01', duration: 0.5, reason: 'Headache - half day', status: 'approved' },
    { empIdx: 3, leave_type: 'casual', from_date: '2025-04-28', to_date: '2025-04-29', duration: 2, reason: 'Moving house', status: 'approved' },
    { empIdx: 3, leave_type: 'earned', from_date: '2025-05-10', to_date: '2025-05-13', duration: 4, reason: 'Family trip', status: 'rejected' },
    { empIdx: 4, leave_type: 'casual', from_date: '2025-05-02', to_date: '2025-05-06', duration: 3, reason: 'Wedding', status: 'approved' },
    { empIdx: 4, leave_type: 'sick', from_date: '2025-05-15', to_date: '2025-05-15', duration: 1, reason: 'Cold', status: 'approved' },
  ];

  for (const app of leaveApps) {
    await pool.query(
      'INSERT INTO leave_applications (employee_id, leave_type, from_date, to_date, duration, reason, status) VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [employeeIds[app.empIdx], app.leave_type, app.from_date, app.to_date, app.duration, app.reason, app.status]
    );
  }
  console.log('Leave applications inserted');

  // Salary slips - last 3 months
  const salaryMonths = ['2025-03', '2025-04', '2025-05'];
  const lopData = [
    [1, 0, 2],
    [0, 1, 0],
    [2, 1, 3],
    [0, 0, 1],
    [1, 2, 0],
  ];

  for (let i = 0; i < employeeIds.length; i++) {
    const empId = employeeIds[i];
    const monthlySalary = employees[i].monthly_salary;
    const basic = monthlySalary * 0.6;
    const hra = monthlySalary * 0.4;

    for (let m = 0; m < salaryMonths.length; m++) {
      const lopDays = lopData[i][m];
      const lopDeduction = (monthlySalary / 30) * lopDays;
      const netSalary = basic + hra - lopDeduction;

      await pool.query(
        'INSERT INTO salary_slips (employee_id, month, basic, hra, lop_days, lop_deduction, net_salary) VALUES ($1,$2,$3,$4,$5,$6,$7)',
        [empId, salaryMonths[m], basic, hra, lopDays, Math.round(lopDeduction * 100) / 100, Math.round(netSalary * 100) / 100]
      );
    }
  }
  console.log('Salary slips inserted');

  console.log('Seed completed successfully');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
