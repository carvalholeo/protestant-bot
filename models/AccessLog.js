'use strict';
// @ts-check

const BaseLogModel = require('./BaseLog');
/**
 * Class to log general of the application
 * @class AccessLog
 * @extends BaseLogModel
 */
class AccessLog extends BaseLogModel {
  /**
   * On instanciate Access Log class, it's necessary to provide the table to
   * handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('access');
  }
}

module.exports = AccessLog;
