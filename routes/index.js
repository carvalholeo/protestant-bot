'use strict';
const { Router } = require('express');

const TweetsController = require('../controllers/TweetsController');

const routes = Router();

routes.get('/', TweetsController.getTweets);

module.exports = routes;
