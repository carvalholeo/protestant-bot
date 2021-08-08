'use strict';
// @ts-check

const {Router} = require('express');
const fullAppSanitizer = require('../validators/fullAppSanitizer');

const blocklist = require('./blocklist');
const tweets = require('./tweets');
const users = require('./users');

// eslint-disable-next-line new-cap
const routes = Router();

routes.use(fullAppSanitizer);

routes.use('/blocklist', blocklist);
routes.use('/tweets', tweets);
routes.use('/users', users);

module.exports = routes;
