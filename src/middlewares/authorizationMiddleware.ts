import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
const secret = process.env.JWT_SECRET ?? '';

/**
 * Function to handle with errors from Express Validator.
 * @param {Request} req Object with the Request
 * @param {Response} res Object to handle with response
 * @param {Function} next Callback to be called if no errors occured.
 * @return {Response} Returns with response object if a error were found.
 */
function authorizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { authorization = '' } = req.headers;

    const parts = authorization.split(' ');
    const [scheme, token] = parts;

    if (!authorization) {
      throw new Error('No token provided.');
    }

    if (parts.length !== 2) {
      throw new Error('Failed to process request.');
    }

    if (!/Bearer/i.test(scheme)) {
      throw new Error('Malformed token.');
    }
    verify(token, secret, (error, _decoded) => {
      if (error) {
        throw new Error('Invalid token.');
      }

      next();
    });
  } catch (error: any) {
    return res.status(401).json({ error: error.message });
  }
}

export default authorizationMiddleware;
