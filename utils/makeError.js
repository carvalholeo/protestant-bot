'use strict';

const TweetStreams = require('../singletons/TweetStreams');
const logger = require('../logs/logger');

const tweetStreams = new TweetStreams();

function makeError(error, origin) {
  process.nextTick(() => tweetStreams.killInstance());
  const message = `An error was produced by ${origin}. The message emitted was '${error}'.`;

  logger('error', message);
}

module.exports = makeError;
