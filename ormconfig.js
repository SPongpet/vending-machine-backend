const {
  NODE_ENV: env,
  DB_HOST: host,
  DB_PORT: port,
  DB_USERNAME: username,
  DB_PASSWORD: password,
  DB_DATABASE: database,
  DB_SYNCHRONIZE: synchronize,
  DB_LOGGING: logging,
  DB_CONNECTION_LIMIT: dbConnectionLimits,
} = process.env;

const DEFAULT_PORT = 3306;
const DEFAULT_CONNECTION_LIMIT = 3;
const isLocal = (env || 'production') === 'local';
let ext, homeDir;

if (isLocal) {
  homeDir = 'src';
  ext = 'ts';
} else {
  homeDir = 'dist';
  ext = 'js';
}

const config = {
  type: 'mysql',
  host,
  port: Number(port) || DEFAULT_PORT,
  username,
  password,
  database,
  synchronize: synchronize === 'true',
  logging: logging === 'true',
  entities: [`${homeDir}/presenters/**/Entity.${ext}`],
  migrations: [`${homeDir}/migrations/*.${ext}`],
  cli: {
    entitiesDir: `${homeDir}/presenters`,
    migrationsDir: `${homeDir}/migrations`,
  },
  extra: {
    connectionLimit: Number(dbConnectionLimits) || DEFAULT_CONNECTION_LIMIT,
  },
};

module.exports = config;
