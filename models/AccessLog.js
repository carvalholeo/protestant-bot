'use strict';

const BaseModel = require('./Base');

class AccessLog extends BaseModel {
  constructor() {
    super('access_log');
  }
}

module.exports = AccessLog;