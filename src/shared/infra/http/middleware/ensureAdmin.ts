import { NextFunction, Request, Response } from 'express';

import { AppError } from '@shared/errors/AppError';

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { isAdmin } = request.user;

  if (!isAdmin) throw new AppError('User isnt admin', 401);

  return next();
}
