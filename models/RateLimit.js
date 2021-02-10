'use strict';

const BaseModel = require('./Base');

class RateLimit extends BaseModel {
  constructor() {
    super('rate_limit');
  }
}

module.exports = RateLimit;