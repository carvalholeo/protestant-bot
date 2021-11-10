interface LogDatabase {
  level: string;
  emmiter: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default LogDatabase;
