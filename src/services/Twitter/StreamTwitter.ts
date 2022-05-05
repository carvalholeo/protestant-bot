import logger from '../../services/logs/logger';
import client from '../api/client';
import isReply from '../../utils/isReply';

import Tweet from '../../interfaces/typeDefinitions/Tweet';

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
  getInstance(): any {
    try {
      if (typeof (StreamTwitter._instance) === 'undefined' ||
        StreamTwitter._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      return StreamTwitter._instance;
    } catch (error: any) {
      logger.error(`${error.message} at Stream.getInstance.catch`);

      StreamTwitter._instance = client.stream(
        'tweets/search/stream', QUERY_STRING);
      return StreamTwitter._instance;
    }
  }

  /**
   * Method to close connection, destroy stream and set static member to null.
   */
  killInstance(): void {
    try {
      if (typeof (StreamTwitter._instance) === 'undefined' ||
        StreamTwitter._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      logger.debug(`App shut down. Reason: Killer method was invoked at Stream.killInstance.try`)

      StreamTwitter._instance.close();
    } catch (error: any) {
      logger.error(`${error.message} at Stream.killInstance.catch`);
    }
  }

  /**
   * Method to handle with states of the stream.
   */
  handleStream() {
    try {
      const stream = StreamTwitter._instance;

      stream
        .on('start', () => {
          const message = 'Stream was initialized';
          logger.info(`${message} at Stream.handleStream.try.start`);
        })
        .on('data', async (tweet: Tweet) => {
          const isTweetReply = isReply(tweet);
          const retweet = new this.RetweetClass(tweet);

          if (!isTweetReply) {
            await retweet.retweet(tweet);
          }
        })
        .on('ping', () => {
          const message = `Ping to keep connection alive`;
          console.info(message);
          logger.verbose(`${message} at Stream.handleStream.try.ping`);
        })
        .on('end', (response: unknown) => {
          this.killInstance();
          const message = `Method handleStream, from class Stream
            receive an end event. This is the complete object received:
            ${response}`;
          logger.error(`${message} at Stream.handleStream.try.end`);
          console.error(message);
        })
        .on('error', (error: any) => {
          process.nextTick(() => stream.destroy());
          this.killInstance();
          logger.crit(`${error.message} at Stream.handleStream.try.error`)
          console.error(error);
        });
    } catch (error: any) {
      logger.error(`${error.message} at Stream.handleStream.catch`)
    }
  }
}

export default StreamTwitter;
