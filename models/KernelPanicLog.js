'use strict';

const BaseModel = require('./Base');

class KernelPanic extends BaseModel {
  constructor() {
    super('kernel_panic_log');
  }
}

module.exports = KernelPanic;