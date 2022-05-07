import { Request, Response, NextFunction } from 'express';
import expressBouncer from 'express-bouncer';
const bouncerLimiter = expressBouncer(1000, 900000, 5);

bouncerLimiter.whitelist.push(
  '127.0.0.1',
  'localhost',
  '::1',
  '::ffff:127.0.0.1'
);

/**
 * Function to handle with rate limiting and API throttling in the app.
 * @param {Request} req Object with the Request
 * @param {Response} res Object to handle with response
 * @param {NextFunction} next Callback to be called if no errors occured.
 * @param {number} remaining Time, in miliseconds, to next rate limit reset.
 * @return {Response} Returns with response object if a error were found.
 */
bouncerLimiter.blocked = function (
  _req: Request,
  res: Response,
  _next: NextFunction,
  remaining: number
): Response {
  return res.status(429).json({
    message: `Too many requests have been made.
Please wait ${remaining / 1000} seconds.`,
  });
};

export default bouncerLimiter;
