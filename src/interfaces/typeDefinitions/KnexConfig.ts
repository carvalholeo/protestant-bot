interface KnexConfig {
  development?: Config;
  staging?: Config;
  production?: Config;
  test?: Config;
}

interface Config {
  client: string;
    connection: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
    migrations?: {
      directory: string;
      extension: string;
      tableName: string;
    }
    seeds?: {
      directory: string;
      extension: string;
    }
    pool?: {
      min: number;
      max: number;
    }
    useNullAsDefault?: boolean;
    acquireConnectionTimeout: number;
}

export default KnexConfig;