const BaseLogModel = require('./BaseLog');
/**
 * Class to log all retweets done by the application
 * @class RetweetLog
 * @extends BaseLogModel
 */
class RetweetLog extends BaseLogModel {
  /**
   * On instanciate Retweet Log class, it's necessary to provide the table to
   * handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('retweet');
  }
}

module.exports = RetweetLog;
