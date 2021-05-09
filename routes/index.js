'use strict';
// @ts-check

const {Router} = require('express');

const validatorMiddleware = require('../middlewares/validatorMiddleware');
const authorizationMiddleware =
  require('../middlewares/authorizarionMiddleware');

const tokenValidator = require('../validators/privateApi/tokenValidator');

const blocklist = require('./blocklist');
const tweets = require('./tweets');

// eslint-disable-next-line new-cap
const routes = Router();

routes.use('/blocklist', blocklist);

routes.use(tokenValidator);
routes.use(validatorMiddleware);

routes.use(authorizationMiddleware);

routes.use('/tweets', tweets);

module.exports = routes;
