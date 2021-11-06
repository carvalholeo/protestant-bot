import BaseLogModel from './BaseLog';

/**
 * Class to log errors generated on the application.
 * @class ErrorLog
 * @extends BaseLogModel
 */
class ErrorLog extends BaseLogModel {
  /**
   * On instantiate Error Log class, it's necessary to provide the table to
   * handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('error');
  }
}

export default ErrorLog;
