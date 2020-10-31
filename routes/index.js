'use strict';
const { Router } = require('express');

const TweetsController = require('../controllers/TweetsController');

const routes = Router();

routes.get('/', (req, res) => {
  return res.status(200).send("It's working.")
});

routes.post('/', TweetsController.getTweets);

module.exports = routes;
