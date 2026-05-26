import { Request, Response, NextFunction } from 'express';

type ValidationFn = (data: any) => string | null;

export function validate(source: 'body' | 'query', validationFn: ValidationFn) {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'body' ? req.body : req.query;
    const error = validationFn(data);

    if (error) {
      res.status(400).json({ error });
      return;
    }

    next();
  };
}
