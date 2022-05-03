import logger from '../../logs/logger';
import client from '../api/client';
import isReply from '../../utils/isReply';

import Tweet from '../../interfaces/typeDefinitions/Tweet';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

const { QUERY, WORD_BLOCKLIST } = process.env;
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
  private static _instance: any;
  public RetweetClass: any;
  /**
   * Verify if there's a instance running and, if not, instantiate a new.
   * @param {Function} retweetClass Class to handle with retweets.
   */
  constructor(retweetClass: Function = () => { }) {
    if (typeof (StreamTwitter._instance) === 'undefined') {
      StreamTwitter._instance = client.stream('statuses/filter', QUERY_STRING);
    }

    this.RetweetClass = retweetClass;
  }

  /**
   * Method to retrieve an instance of the Stream.
   * @return {StreamTwitter} Returns the static member variable with the
   * instance running now.
   */
  async getInstance(): Promise<any> {
    try {
      if (typeof (StreamTwitter._instance) === 'undefined' ||
        StreamTwitter._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      return StreamTwitter._instance;
    } catch (error: any) {
      const message: LogDatabase = {
        emmiter: 'Stream.getInstance.catch',
        level: 'error',
        message: error.message,
      };
      await logger(message);

      StreamTwitter._instance = client.stream(
        'tweets/search/stream', QUERY_STRING);
      return StreamTwitter._instance;
    }
  }

  /**
   * Method to close connection, destroy stream and set static member to null.
   */
  async killInstance(): Promise<void> {
    try {
      if (typeof (StreamTwitter._instance) === 'undefined' ||
        StreamTwitter._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      const message: LogDatabase = {
        emmiter: 'Stream.killInstance.try',
        level: 'debug',
        message: 'App shut down. Reason: Killer method was invoked.',
      };
      await logger(message);

      StreamTwitter._instance.close();
    } catch (error: any) {
      const message: LogDatabase = {
        emmiter: 'Stream.killInstance.catch',
        level: 'error',
        message: error.message,
      };
      await logger(message);
    }
  }

  /**
   * Method to handle with states of the stream.
   */
  async handleStream() {
    try {
      const stream = StreamTwitter._instance;

      stream
        .on('start', async () => {
          const message: LogDatabase = {
            emmiter: 'Stream.handleStream.try.start',
            level: 'info',
            message: 'Stream was initialized',
          };
          await logger(message);
          console.info(message.message);
        })
        .on('data', async (tweet: Tweet) => {
          const isTweetReply = isReply(tweet);
          const retweet = new this.RetweetClass(tweet);

          if (!isTweetReply) {
            await retweet.retweet(tweet);
          }
        })
        .on('ping', async () => {
          const message: LogDatabase = {
            emmiter: 'Stream.handleStream.try.ping',
            level: 'debug',
            message: 'Ping to keep connection alive',
          };
          await logger(message);
          console.info(message.message);
        })
        .on('end', async (response: unknown) => {
          this.killInstance();
          const message = `Method handleStream, from class Stream
            receive an end event. This is the complete object received:
            ${response}`;
          const logObject: LogDatabase = {
            emmiter: 'Stream.handleStream.try.end',
            level: 'error',
            message: message,
          };
          await logger(logObject);
          console.error(message);
        })
        .on('error', async (error: any) => {
          process.nextTick(() => stream.destroy());
          this.killInstance();
          const logObject: LogDatabase = {
            emmiter: 'Stream.handleStream.try.error',
            level: 'critical',
            message: error.message,
          };
          await logger(logObject);
          console.error(error);
        });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'Stream.handleStream.catch',
        level: 'error',
        message: error.message,
      };
      await logger(logObject);
    }
  }
}

export default StreamTwitter;
