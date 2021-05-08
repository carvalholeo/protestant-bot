'use strict';
// @ts-check

/**
 * Function to verify if the tweet it's a reply, deleted or a retweet.
 * @param {JSON} tweet Tweet to be verified
 * @return {boolean}
 */
function isReply(tweet) {
  if (tweet.retweeted_status ||
    tweet.in_reply_to_status_id ||
    tweet.in_reply_to_status_id_str ||
    tweet.in_reply_to_user_id ||
    tweet.in_reply_to_user_id_str ||
    tweet.in_reply_to_screen_name ||
    tweet.retweeted_status ||
    tweet.delete) {
    return true;
  }
  return false;
}

module.exports = isReply;
