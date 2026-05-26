export const APP_NAME = 'hrms-backend';

export const LEAVE_TYPES = ['casual', 'sick', 'earned'] as const;

export const DEFAULT_LEAVE_QUOTA = {
  casual: 12,
  sick: 8,
  earned: 15,
};

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
