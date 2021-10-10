// @ts-check

const connection = require('../database/connection');
const logger = require('../logs/logger');

/**
 * Class to emulate interface at Javascript.
 * Shouldn't be instanciated.
 */
class Base {
  /**
   * @param {string} nameOfModel Name of the model to connect
   */
  constructor(nameOfModel) {
    try {
      if (typeof(nameOfModel) === 'undefined' || nameOfModel === null) {
        throw new ReferenceError('You must to provide a table to be handled.');
      }
      this.dateTime = new Date();
      this._connection = connection(nameOfModel);
    } catch (error) {
      this.emergencyLog(error.message);
    }
  }
  /**
   * Use this method only when database logging is unavailable.
   * @param {string} message Message to be stored at Kernel Panic log.
   */
  emergencyLog(message) {
    logger('kernel_panic', message);
  }
}

module.exports = Base;
