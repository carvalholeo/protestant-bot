'use strict';
const { Router } = require('express');

const TweetsController = require('../controllers/TweetsController');

const routes = Router();
const tweetsController = new TweetsController();

routes.use((req, res, next) => {
  console.log(`Uma chamada para a URL ${req.url}, no método ${req.method}, foi efetuada.`)
  next();
});

routes.get('/', (req, res) => {
  return res.status(200).send("It's working.")
});

routes.post('/', tweetsController.getTweets);

module.exports = routes;
