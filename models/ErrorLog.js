'use strict';

const BaseModel = require('./Base');

class ErrorLog extends BaseModel {
  constructor() {
    super('error_log');
  }
}

module.exports = ErrorLog;