interface UserInterface {
  token?: string;
  username: string;
  password?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export default UserInterface;
