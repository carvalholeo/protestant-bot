interface RetweetLogInterface {
  id: number;
  tweet_id: string;
  screen_name: string;
  tweet: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}

export default RetweetLogInterface;
