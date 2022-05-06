import { Request, Response } from 'express';
import logger from '../utils/logs/logger';

interface Error {
  message: string;
  status: number;
}

function errorHandlerMiddleware(err: Error, req: Request, res: Response) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  logger.crit(`An error has occurred on requesting ${req.path}, resulting into error ${err.status}. ID: ${req.app.get('uniqueIdentifier')}`);

  // render the error page
  res
    .status(err.status || 500)
    .json({ 'message': err.message });
}

export default errorHandlerMiddleware;
