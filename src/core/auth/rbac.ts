// Role-based access control placeholder

export type Role = 'admin' | 'manager' | 'employee';

export function hasPermission(role: Role, action: string): boolean {
  const permissions: Record<Role, string[]> = {
    admin: ['*'],
    manager: ['view_team', 'approve_leave', 'view_attendance', 'view_payroll'],
    employee: ['view_own', 'apply_leave', 'view_attendance', 'view_payroll'],
  };

  const allowed = permissions[role];
  return allowed.includes('*') || allowed.includes(action);
}
