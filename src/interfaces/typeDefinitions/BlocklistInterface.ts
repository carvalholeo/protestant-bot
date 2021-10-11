interface BlocklistInterface {
  screen_name: string;
  is_blocked_now: boolean;
  blocked_by_admin: boolean;
  comment: string;
  created_at: Date;
  updated_at: Date;
}

export default BlocklistInterface;
