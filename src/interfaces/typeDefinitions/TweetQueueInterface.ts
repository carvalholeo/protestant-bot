interface TweetQueueInterface {
  tweet: string;
  tweet_id: string;
  already_retweeted: boolean;
  created_at: Date;
  updated_at: Date;
}

export default TweetQueueInterface;
