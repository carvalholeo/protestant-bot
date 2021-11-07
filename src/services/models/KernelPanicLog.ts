import models from '../../db/models';
import Base from './Base';
import BaseLogInterface from '../../interfaces/typeDefinitions/LogDatabase';
import ErrorObject from '../../interfaces/typeDefinitions/ErrorObject';
/**
 * Class to log fatal, unrecoverable erros on the application
 * @class KernelPanicLog
 */
class KernelPanic extends Base {
  /**
   * Method to create a log message at the database
   * @param {string} message Message is a string with the message to be logged.
   */
  async create(message: string) {
    try {
      if (message === undefined) {
        throw new ReferenceError('You must to provide a message to be logged.');
      }
      await models.KernelPanicLog.create({message});
    } catch (error: any) {
      this.emergencyLog(error.message);
    }
  }

  /**
   * Method to retrieve all log from the selected model.
   * @return {Promise<BaseLogInterface[] | ErrorObject>} Returns an
   * array of literal objects, within:
   * - ID of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getAllMessagesFromLog(): Promise<BaseLogInterface[] | ErrorObject> {
    try {
      return await models.KernelPanicLog.findAll();
    } catch (error: any) {
      this.emergencyLog(error.message);
      return {message: error.message};
    }
  }

  /**
   * Method to retrieve only one message from the log in the database.
   * @param {number} id ID of the message to be retrieved from the database.
   * @return {Promise<BaseLogInterface | ErrorObject>} Returns a literal object,
   * with:
   * - ID of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getOneMessageFromLog(id: number):
    Promise<BaseLogInterface | ErrorObject> {
    try {
      if (typeof (id) === 'undefined') {
        throw new ReferenceError('You must to provide a id to get log.');
      }
      return await models.KernelPanicLog.findOne({
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

export default KernelPanic;
