'use strict';

const BaseModel = require('./Base');

class Blocklist extends BaseModel {
  constructor() {
    super('blocklist');
  }
}

module.exports = Blocklist;