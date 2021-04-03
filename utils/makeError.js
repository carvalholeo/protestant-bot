'use strict';

const Stream = require('../services/Twitter/Stream');
const {ErrorLog} = require('../models');
const logger = require('../logs/logger');

const stream = new Stream();

/**
 * Function called when some point needs to stop stream.
 * After close connection, the problem is logged and system exited.
 * @param {string} error Error message emitted from the origin.
 * @param {string} origin Original source of the error.
 */
async function makeError(error, origin) {
  process.nextTick(() => stream.killInstance());
  const message = `An error was produced by ${origin}.
  The message emitted was '${error}'.`;
  await logger('error', message, new ErrorLog());
}

module.exports = makeError;
