
import logger from '../logs/logger';
import LogDatabase from '../interfaces/typeDefinitions/LogDatabase';

/**
 * Function to generate a log and stop the bot.
 * @param {any} error Error generated from application that leads to
 * system shutdown.
 * @param {NodeJS.Timer} initializeBot Constant with an instance of
 * setInterval/setTimeout, to be dropped.
 */
async function appError(error: any, initializeBot: NodeJS.Timer) {
  const message = `Error on bot. Reason: ${error}`;

  const logObject: LogDatabase = {
    level: 'error',
    emmiter: 'Function appError',
    message,
  };

  await logger(logObject);

  clearInterval(initializeBot);
  process.exit(1);
}

export default appError;
