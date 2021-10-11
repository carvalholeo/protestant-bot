import Base from './Base';
import BaseLogInterface from '../interfaces/typeDefinitions/LogDatabase';
import ErrorObject from '../interfaces/typeDefinitions/ErrorObject';
import { Knex } from 'knex';

/**
 * Class to emulate interface of logs at Javascript.
 * Shouldn't be instantiated.
 */
abstract class BaseLog extends Base {
  /**
   * @param nameOfModel Name of the log model to connect
   */
  constructor(nameOfModel: string) {
    super(`${nameOfModel}_log`);
  }

  /**
   * Method to create a log message at the database
   * @param message Message is a string with the message to be logged.
   */
  async create(message: string) {
    try {
      if (message === undefined) {
        throw new ReferenceError('You must to provide a message to be logged.');
      }
      const date = new Date();
      const [insert] = await this._connection
          .insert({message, created_at: date, updated_at: date});

      if (!(insert >= 1)) {
        throw new Error('Message cannot be logged');
      }
    } catch (error: any) {
      this.emergencyLog(error.message);
    }
  }

  /**
   * Method to retrieve all log from the selected model.
   * @return {Promise<Knex<BaseLogInterface>[] | ErrorObject>} Returns an array of literal objects,
   * within:
   * - ID of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getAllMessagesFromLog(): Promise<BaseLogInterface[] | ErrorObject> {
    try {
      return await this._connection
          .select('*');
    } catch (error: any) {
      this.emergencyLog(error.message);
      return {message: error.message};
    }
  }

  /**
   * Method to retrieve only one message from the log in the database.
   * @param {number} id ID of the message to be retrieved from the database.
   * @return {Promise<BaseLogInterface | ErrorObject>} Returns a literal object, with
   * - ID of the message
   * - Message
   * - Date and time of creation
   * - Date and time of the last update
   */
  async getOneMessageFromLog(id: number): Promise<BaseLogInterface | ErrorObject> {
    try {
      if (typeof(id) === 'undefined') {
        throw new ReferenceError('You must to provide a id to get log.');
      }
      return await this._connection
          .where({id: id})
          .select('*')
          .first();
    } catch (error: any) {
      this.emergencyLog(error.message);
      return {message: error.message};
    }
  }
}

export default BaseLog;
