import { Request, Response, NextFunction } from 'express';
import { v4 } from 'uuid';

function logUniqueIdentifier(req: Request, _res: Response, next: NextFunction) {
  const identifier = v4();

  req.app.set('uniqueIdentifier', identifier);
  next();
}

export default logUniqueIdentifier;
