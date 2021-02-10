'use strict';

const connection = require('../database/connection');

class Base {
  constructor(nameOfModel) {
    this.connection = connection(nameOfModel);
  }
}

module.exports = Base;
