import StreamTwitter from '../services/Twitter/Stream';
import logger from '../logs/logger';
import LogDatabase from '../interfaces/typeDefinitions/LogDatabase';

const stream = new StreamTwitter();

/**
 * Function called when some point needs to stop stream.
 * After close connection, the problem is logged and system exited.
 * @param {string} error Error message emitted from the origin.
 * @param {string} origin Original source of the error.
 */
async function makeError(error: string, origin: string) {
  process.nextTick(() => stream.killInstance());
  const message = `An error was produced by ${origin}.
  The message emitted was '${error}'.`;

  const logObject: LogDatabase = {
    level: 'error',
    emmiter: origin,
    message,
  };

  await logger(logObject);
}

export default makeError;
