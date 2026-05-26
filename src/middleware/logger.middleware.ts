import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/logger/logger';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} ${res.statusCode}`, { duration: `${duration}ms` });
  });

  next();
}
