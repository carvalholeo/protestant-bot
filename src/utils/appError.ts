import logger from '../services/logs/logger';

/**
 * Function to generate a log and stop the bot.
 * @param {any} error Error generated from application that leads to
 * system shutdown.
 * @param {NodeJS.Timer} initializeBot Constant with an instance of
 * setInterval/setTimeout, to be dropped.
 */
function appError(error: any, initializeBot: NodeJS.Timer) {
  const message = `Error on bot. Reason: ${error}`;

  logger.error(`${message} at Function appError.`);

  clearInterval(initializeBot);
  process.exit(1);
}

export default appError;
