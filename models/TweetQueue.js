'use strict';

const BaseModel = require('./Base');

class TweetQueue extends BaseModel {
  constructor() {
    super('tweet_queue');
  }
}

module.exports = TweetQueue;