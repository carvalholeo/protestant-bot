const {Router} = require('express');

const blocklist = require('./blocklist');

// eslint-disable-next-line new-cap
const routes = Router();

routes.use('/blocklist', blocklist);

module.exports = routes;
