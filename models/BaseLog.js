'use strict';
const Base = require('./Base');

/**
 * Class to emulate interface of logs at Javascript.
 * Shouldn't be instanciated.
 */
class BaseLog extends Base {
  /**
   * @param {string} nameOfModel Name of the log model to connect
   */
  constructor(nameOfModel) {
    super(`${nameOfModel}_log`);
  }

  /**
   * Method to create a log message at the database
   * @param {string} message Message is a string with the message to be logged.
   */
  async create(message) {
    try {
      if (typeof(message) === 'undefined') {
        throw new ReferenceError('You must to provide a message to be logged.');
      }
      const date = new Date();
      const [insert] = await this._connection
          .returning('id')
          .insert({message, created_at: date, updated_at: date});

      if (!insert >= 1) {
        throw new Error('Message cannot be logged');
      }
    } catch (error) {
      this.emergencyLog(error.message);
    }
  }

  /**
   * Method to retrieve all log from the selected model.
   * @return {Array<Object>} Returns an array of literal objects, within:
   * - ID of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getAllMessagesFromLog() {
    try {
      return await this._connection
          .select('*');
    } catch (error) {
      this.emergencyLog(error.message);
    }
  }

  /**
   * Method to retrieve only one message from the log in the database.
   * @param {number} id ID of the message to be retrieved from the database.
   * @return {JSON} Returns a literal object, with
   * - ID of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getOneMessageFromLog(id) {
    try {
      if (typeof(id) === 'undefined') {
        throw new ReferenceError('You must to provide a id to get log.');
      }
      return await this._connection
          .where({id: id})
          .select('*')
          .first();
    } catch (error) {
      this.emergencyLog(error.message);
    }
  }
}

module.exports = BaseLog;
