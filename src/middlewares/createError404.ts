import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import logger from '../utils/logs/logger';

function createError404(req: Request, _res: Response, next: NextFunction) {
  logger.warn(
    `Request to ${req.path} resulted into error 404. ID: ${req.app.get(
      'uniqueIdentifier'
    )}`
  );
  next(createError(404));
}

export default createError404;
