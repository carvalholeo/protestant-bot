import { createLogger, config, transports as _transports } from 'winston';
import { resolve } from 'path';

const options = {
  file: {
    level: 'verbose',
    filename: resolve(__dirname, '..', '..', 'logs', 'app.log'),
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  levels: config.npm.levels,
  transports: [
    new _transports.File(options.file),
    new _transports.Console(options.console),
  ],
  exitOnError: false,
});

export default logger;
