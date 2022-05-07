import StreamTwitter from '../services/Twitter/StreamTwitter';
import logger from './logs/logger';

const stream = new StreamTwitter();

/**
 * Function called when some point needs to stop stream.
 * After close connection, the problem is logged and system exited.
 * @param {string} error Error message emitted from the origin.
 * @param {string} origin Original source of the error.
 */
function makeError(error: string, origin: string) {
  process.nextTick(() => stream.killInstance());
  const message = `An error was produced by ${origin}.
  The message emitted was '${error}'.`;

  logger.error(`${message} at ${origin}.`);
}

export default makeError;
