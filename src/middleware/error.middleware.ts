import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger/logger';

export function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Unhandled error', {
    message: err.message,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({ error: 'Internal server error' });
}
