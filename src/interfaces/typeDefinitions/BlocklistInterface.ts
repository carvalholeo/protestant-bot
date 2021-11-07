interface BlocklistInterface {
  screen_name: string;
  is_blocked_now: boolean;
  blocked_by_admin: boolean;
  comment: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default BlocklistInterface;
