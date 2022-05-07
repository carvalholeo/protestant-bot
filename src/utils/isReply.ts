import Tweet from '../interfaces/typeDefinitions/Tweet';

/**
 * Function to verify if the tweet it's a reply, deleted or a retweet.
 * @param tweet Tweet to be verified
 * @return If true, so tweet is a reply to someone
 */
function isReply(tweet: Tweet): boolean {
  if (
    tweet.retweeted_status ||
    tweet.in_reply_to_status_id ||
    tweet.in_reply_to_status_id_str ||
    tweet.in_reply_to_user_id ||
    tweet.in_reply_to_user_id_str ||
    tweet.in_reply_to_screen_name ||
    tweet.delete
  ) {
    return true;
  }
  return false;
}

export default isReply;
