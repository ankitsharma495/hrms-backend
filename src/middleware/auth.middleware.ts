import { Request, Response, NextFunction } from 'express';
import { env } from '../core/config/env';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey !== env.API_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  next();
}
