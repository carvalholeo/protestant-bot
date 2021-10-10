// @ts-check
'use strict';

/**
 * Function to verify if token provided were previously invalidated.
 * @param {Request} req Object with the Request
 * @param {Response} res Object to handle with response
 * @param {Function} next Callback to be called if no errors occurred.
 * @return {Response} Returns with response object if the token is invalid.
 */
function verifyLogoutMiddleware(req, res, next) {
  // @ts-ignore
  const {authorization} = req.headers;
  // @ts-ignore
  const {map} = req;
  const token = map.get(authorization);

  if (token) {
    // @ts-ignore
    return res.status(401)
        .json({error: 'Token invalid: User made logout previously'});
  }

  return next();
}

module.exports = verifyLogoutMiddleware;
