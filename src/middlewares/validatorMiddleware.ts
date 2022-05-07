import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Function to handle with errors from Express Validator.
 * @param {Request} req Object with the Request
 * @param {Response} res Object to handle with response
 * @param {NextFunction} next Callback to be called if no errors occurred.
 * @return {Response} Returns with response object if a error were found.
 */
function validatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(406).json({
      message: 'Your request is invalid. Here are the errors',
      errors: errors.mapped(),
    });
  }

  next();
}

export default validatorMiddleware;
