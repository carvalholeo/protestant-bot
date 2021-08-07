'use strict';
// @ts-check

const {Router} = require('express');
const fullAppSanitizer = require('../validators/fullAppSanitizer');

const blocklist = require('./blocklist');
const tweets = require('./tweets');

// eslint-disable-next-line new-cap
const routes = Router();

routes.use(fullAppSanitizer);

routes.use('/blocklist', blocklist);
routes.use('/tweets', tweets);

module.exports = routes;
