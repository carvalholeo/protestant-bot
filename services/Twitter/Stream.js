'use strict';

const {ErrorLog, AccessLog} = require('../../models');
const logger = require('../../logs/logger');
const client = require('../client');
const isReply = require('../../utils/isReply');

const {QUERY} = process.env;

/**
 * Class to handle with incoming stream of tweet with configured parameters.
 * It follows the singleton pattern.
 * @class Stream
 */
class Stream {
  /**
   * Verify if there's a instance running and, if not, instanciate a new.
   * @param {function} retweetClass Class to handle with retweets.
   */
  constructor(retweetClass) {
    const query = {
      track: QUERY,
      // follow: '1338363022402875397',
    };
    if (typeof(Stream._instance) === 'undefined') {
      Stream._instance = client.stream('statuses/filter', query);
    }

    this.RetweetClass = retweetClass;
  }

  /**
   * Method to retrieve an instance of the Stream.
   * @return {Stream} Returns the static member variable with the instance
   * running now.
   */
  getInstance() {
    try {
      if (typeof(Stream._instance) === 'undefined' ||
          Stream._instance === null) {
        throw new ReferenceError('There isn\'t an instance running.');
      }
      return Stream._instance;
    } catch (error) {
      const message = `There was an error on during attempt of shut down app.
      Reason: ${error}.`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to close connection, destroy stream and set static member to null.
   */
  killInstance() {
    try {
      if (typeof(Stream._instance) !== 'undefined' ||
          Stream._instance !== null) {
        const message = `App shut down. Reason: Killer method was invoked.`;
        logger('access', message, new AccessLog());
      } else {
        throw new ReferenceError('There isn\'t an instance running.');
      }
    } catch (error) {
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
      const stream = this.getInstance();

      stream.setMaxListeners(32);

      stream
          .on('start', async () => {
            const message = `Stream was initialized`;
            await logger('access', message, new AccessLog());
            console.info(message);
          })
          .on('data', (tweet) => {
            const isTweetReply = isReply(tweet);
            const retweet = new this.RetweetClass(tweet);

            if (!isTweetReply) {
              retweet.retweet(tweet);
            }
          })
          .on('ping', async () => {
            const message = `Ping to keep connection alive`;
            await logger('access', message, new AccessLog());
            console.info(message);
          })
          .on('end', async (response) => {
            this.killInstance();
            const message = `Method handleStream, from class Stream
            receive an end event. This is the complete object received:
            ${response}`;
            console.error(error);
            await logger('error', message, new ErrorLog());
          })
          .on('error', async (error) => {
            process.nextTick(() => stream.destroy());
            this.killInstance();
            console.error(error);
          });
    } catch (error) {
      const message = `There was an error on try handle incoming streaming.
      Reason: ${error.message}.`;
      logger('error', message, new ErrorLog());
    }
  }
}

module.exports = Stream;
