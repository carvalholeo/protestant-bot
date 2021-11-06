import BaseLogModel from './BaseLog';
/**
 * Class to log general of the application
 * @class AccessLog
 * @extends BaseLogModel
 */
class AccessLog extends BaseLogModel {
  /**
   * On instantiate Access Log class, it's necessary to provide the table to
   * handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('access');
  }
}

export default AccessLog;
