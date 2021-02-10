'use strict';

const Stream = require('../services/Twitter/Stream');
const logger = require('../logs/logger');

const stream = new Stream();

function makeError(error, origin) {
  process.nextTick(() => stream.killInstance());
  const message = `An error was produced by ${origin}. The message emitted was '${error}'.`;

  logger('error', message);
}

module.exports = makeError;
