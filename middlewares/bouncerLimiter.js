// @ts-check

const expressBouncer = require('express-bouncer');
const bouncerLimiter = expressBouncer(1000, 900000, 5);

bouncerLimiter.whitelist.push('127.0.0.1');
bouncerLimiter.whitelist.push('localhost');

/**
 * Function to handle with rate limiting and API throttling in the app.
 * @param {Request} req Object with the Request
 * @param {Response} res Object to handle with response
 * @param {Function} next Callback to be called if no errors occured.
 * @param {Number} remaining Time, in miliseconds, to next rate limit reset.
 * @return {Response} Returns with response object if a error were found.
 */
// @ts-ignore
bouncerLimiter.blocked = function(req, res, next, remaining) {
  return res
      // @ts-ignore
      .status(429)
      .json({message: `Too many requests have been made.
      Please wait ${remaining/1000} seconds.`});
};

module.exports = bouncerLimiter;
