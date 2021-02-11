const {Router} = require('express');

const TweetsController = require('../controllers/TweetsController');
const logger = require('../logs/logger');

// eslint-disable-next-line new-cap
const routes = Router();
const tweetsController = new TweetsController();

routes.use((req, res, next) => {
  const message = `Uma chamada para a URL ${req.url},
    no método ${req.method}, foi efetuada.`;
  logger('access', message);

  next();
});

routes.get('/', (req, res) => res.status(200).send('It\'s working.'));

routes.post('/', tweetsController.getTweets);

module.exports = routes;
