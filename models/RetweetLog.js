'use strict';

const BaseModel = require('./Base');

class RetweetLog extends BaseModel {
  constructor() {
    super('retweet_log');
  }
}

module.exports = RetweetLog;