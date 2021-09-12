'use strict';
// @ts-check

const {Router} = require('express');
const fullAppSanitizer = require('../validators/fullAppSanitizer');

const blocklist = require('./blocklist');
const tweets = require('./tweets');
const users = require('./users');
const contact = require('./contact');

// eslint-disable-next-line new-cap
const routes = Router();

routes.use(fullAppSanitizer);

routes.get('/', (req, res) =>
  res.status(200).json({message: 'API it\'s working!'}));

routes.use('/blocklist', blocklist);
routes.use('/tweets', tweets);
routes.use('/users', users);
routes.use('/contact', contact);

module.exports = routes;
