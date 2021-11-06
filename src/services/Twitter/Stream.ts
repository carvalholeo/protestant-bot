import { ErrorLog, AccessLog } from '../models';
import logger from '../../logs/logger';
import client from '../api/client';
import isReply from '../../utils/isReply';

import Tweet from '../../interfaces/typeDefinitions/Tweet';

const {QUERY, WORD_BLOCKLIST} = process.env;
const QUERY_STRING = {
  track: `${QUERY},${WORD_BLOCKLIST}`,
  // follow: '85838972',
};
/**
 * Class to handle with incoming stream of tweet with configured parameters.
 * It follows the singleton pattern.
 * @class Stream
 */
class StreamTwitter {
  private static _instance:  any;
  public RetweetClass: any;
  /**
   * Verify if there's a instance running and, if not, instantiate a new.
   * @param retweetClass Class to handle with retweets.
   */
  constructor(retweetClass: Function = () => {}) {
    if (typeof(StreamTwitter._instance) === 'undefined') {
      StreamTwitter._instance = client.stream('statuses/filter', QUERY_STRING);
    }

    this.RetweetClass = retweetClass;
  }

  /**
   * Method to retrieve an instance of the Stream.
   * @return {StreamTwitter} Returns the static member variable with the instance
   * running now.
   */
  getInstance(): any {
    try {
      if (typeof (StreamTwitter._instance) === 'undefined' ||
        StreamTwitter._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      return StreamTwitter._instance;
    } catch (error) {
      const message = `There was an error on during attempt of shut down app.
      Reason: ${error}.`;
      logger('error', message, new ErrorLog());
      StreamTwitter._instance = client.stream('tweets/search/stream', QUERY_STRING);
      return StreamTwitter._instance;
    }
  }

  /**
   * Method to close connection, destroy stream and set static member to null.
   */
  killInstance() {
    try {
      if (typeof (StreamTwitter._instance) === 'undefined' ||
        StreamTwitter._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      const message = `App shut down. Reason: Killer method was invoked.`;
      logger('access', message, new AccessLog());

      StreamTwitter._instance.close();
    } catch (error: any) {
      const message = `There was an error on during attempt of shut down app.
      Reason: ${error.message}.`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to handle with states of the stream.
   */
  handleStream() {
    try {
      const stream = StreamTwitter._instance;

      stream
          .on('start', async () => {
            const message = `Stream was initialized`;
            await logger('access', message, new AccessLog());
            console.info(message);
          })
          .on('data', async (tweet: Tweet) => {
            const isTweetReply = isReply(tweet);
            const retweet = new this.RetweetClass(tweet);

            if (!isTweetReply) {
              await retweet.retweet(tweet);
            }
          })
          .on('ping', async () => {
            const message = `Ping to keep connection alive`;
            await logger('access', message, new AccessLog());
            console.info(message);
          })
          .on('end', async (response: unknown) => {
            this.killInstance();
            const message = `Method handleStream, from class Stream
            receive an end event. This is the complete object received:
            ${response}`;
            console.error(message);
            await logger('error', message, new ErrorLog());
          })
          .on('error', async (error: unknown) => {
            process.nextTick(() => stream.destroy());
            this.killInstance();
            console.error(error);
          });
    } catch (error: any) {
      const message = `There was an error on try handle incoming streaming.
      Reason: ${error.message}.`;
      logger('error', message, new ErrorLog());
    }
  }
}

export default StreamTwitter;
