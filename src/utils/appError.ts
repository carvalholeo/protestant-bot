import { ErrorLog } from '../models';
import logger from '../logs/logger';

/**
 * Function to generate a log and stop the bot.
 * @param error Error generated from application that leads to
 * system shutdown.
 * @param initializeBot Constant with an instance of
 * setInterval/setTimeout, to be dropped.
 */
async function appError(error: any, initializeBot: NodeJS.Timer) {
  const message = `Error on bot. Reason: ${error}`;

  await logger('error', message, new ErrorLog());

  clearInterval(initializeBot);
  process.exit(1);
}

export default appError;
