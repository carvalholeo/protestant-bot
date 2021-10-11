interface Tweet {
  quoted_status: Tweet;
  retweeted_status: Tweet;
  in_reply_to_status_id: number;
  in_reply_to_status_id_str: string;
  in_reply_to_user_id: number;
  in_reply_to_user_id_str: string;
  in_reply_to_screen_name: string;
  delete: boolean;
  is_quote_status: boolean;
  id: number;
  id_str: string;
  text: string;
  user: {
    screen_name: string;
  }
}

export default Tweet;
