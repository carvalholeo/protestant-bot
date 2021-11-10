import models from '../../db/models';
import Base from './Base';
import LogObject from '../../interfaces/typeDefinitions/LogDatabase';
import ErrorObject from '../../interfaces/typeDefinitions/ErrorObject';

/**
 * Class to log general of the application
 * @class Log
 */
class Log extends Base {
  /**
   * Method to create a log message at the database
   * @param {LogObject} logObject Object with the following
   * properties:
   * - level: level of the information to be stored
   * - emmiter: which method or function emmited the message
   * - message: message to be stored at database
   */
  async create(logObject: LogObject) {
    try {
      if (logObject === undefined) {
        throw new ReferenceError('You must to provide a message to be logged.');
      }
      await models.Log.create(logObject);
    } catch (error: any) {
      this.emergencyLog(error.message);
    }
  }

  /**
   * Method to retrieve all log from the selected model.
   * @return {Promise<LogObject[] | ErrorObject>} Returns an
   * array of literal objects, within:
   * - ID of the message
   * - Level of the information
   * - Emmiter of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getAllMessagesFromLog(): Promise<LogObject[] | ErrorObject> {
    try {
      return await models.Log.findAll();
    } catch (error: any) {
      this.emergencyLog(error.message);
      return {message: error.message};
    }
  }

  /**
   * Method to retrieve only one message from the log in the database.
   * @param {number} id ID of the message to be retrieved from the database.
   * @return {Promise<LogObject | ErrorObject>} Returns a literal object,
   * with:
   * - ID of the message
   * - Level of the information
   * - Emmiter of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getOneMessageFromLog(id: number):
      Promise<LogObject | ErrorObject> {
    try {
      if (typeof(id) === 'undefined') {
        throw new ReferenceError('You must to provide a id to get log.');
      }
      return await models.Log.findOne({
        where: {
          id,
        },
      });
    } catch (error: any) {
      this.emergencyLog(error.message);
      return {message: error.message};
    }
  }
}

export default Log;
