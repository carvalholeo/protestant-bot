'use strict';
// @ts-check

const {ErrorLog} = require('../models');
const logger = require('../logs/logger');
/**
 * Function to generate a log and stop the bot.
 * @param {object} error Error generated from application that leads to
 * system shutdown.
 * @param {object} initializeBot Constant with an instance of
 * setInterval/setTimeout, to be dropped.
 */
async function appError(error, initializeBot) {
  const message = `Error on bot. Reason: ${error}`;

  await logger('error', message, new ErrorLog());

  clearInterval(initializeBot);
  process.exit(1);
}

module.exports = appError;
