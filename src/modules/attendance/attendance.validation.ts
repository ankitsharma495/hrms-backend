export function validateSummaryQuery(query: any): string | null {
  if (!query.employee_id) return 'employee_id is required';
  if (!query.month) return 'month is required';
  if (!/^\d{4}-\d{2}$/.test(query.month)) return 'month must be in YYYY-MM format';
  return null;
}

export function validateRecentQuery(query: any): string | null {
  if (!query.employee_id) return 'employee_id is required';
  return null;
}
