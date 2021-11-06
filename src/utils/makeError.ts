import StreamTwitter from '../services/Twitter/Stream';
import { ErrorLog } from '../services/models';
import logger from '../logs/logger';

const stream = new StreamTwitter();

/**
 * Function called when some point needs to stop stream.
 * After close connection, the problem is logged and system exited.
 * @param error Error message emitted from the origin.
 * @param origin Original source of the error.
 */
async function makeError(error: string, origin: string) {
  process.nextTick(() => stream.killInstance());
  const message = `An error was produced by ${origin}.
  The message emitted was '${error}'.`;
  await logger('error', message, new ErrorLog());
}

export default makeError;
