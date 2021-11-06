import { Knex, knex } from 'knex';
import connection from '../../database/connection';
import logger from '../../logs/logger';

/**
 * Class to emulate interface at Javascript.
 * Shouldn't be instantiated.
 */
abstract class Base {
  public dateTime: Date = new Date();
  protected _connection: any;
  /**
   * @param {string} nameOfModel Name of the model to connect
   */
  constructor(nameOfModel: string) {
    try {
      if (typeof(nameOfModel) === 'undefined' || nameOfModel === null) {
        throw new ReferenceError('You must to provide a table to be handled.');
      }
      this.dateTime = new Date();
      this._connection = connection(nameOfModel);
    } catch (error: any) {
      this.emergencyLog(error.message);
    }
  }
  /**
   * Use this method only when database logging is unavailable.
   * @param {string} message Message to be stored at Kernel Panic log.
   */
  emergencyLog(message: string) {
    logger('kernel_panic', message);
  }
}

export default Base;
