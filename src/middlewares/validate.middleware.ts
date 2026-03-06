import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError }             from 'zod';

export const validate = (schema: ZodSchema, source: 'body' | 'query' = 'body') =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(
      source === 'body' ? req.body : req.query
    );

    if (!result.success) {
      const errors = result.error.issues.map(
        (i) => `${i.path.join('.')}: ${i.message}`
      );
      res.status(400).json({
        success: false,
        error:   'Validation échouée',
        details: errors,
      });
      return;
    }

    // Remplace req.body/query par les données validées et transformées
    if (source === 'body')  req.body  = result.data;
    if (source === 'query') req.query = result.data as Record<string, string>;

    next();
  };