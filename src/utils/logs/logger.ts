import { resolve } from 'path';
import { createLogger, config, transports, format } from 'winston';
import 'winston-daily-rotate-file';
import { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';

const textFormat = format.combine(
  format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
  format.align(),
  format.printf(i => `${i.level}: ${i.timestamp}: ${i.message}`),
);

const consoleFormat = format.combine(
  format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
  format.align(),
  format.colorize(),
  format.printf(i => `${i.level}: ${i.timestamp}: ${i.message}`),
);

const consoleOptions: transports.ConsoleTransportOptions = {
  consoleWarnLevels: ['warn', 'debug', 'trace'],
  format: consoleFormat,
  handleExceptions: true,
  handleRejections: true,
  level: 'debug',
  stderrLevels: ['error'],
};


const dailyRotateOptions: DailyRotateFileTransportOptions = {
  datePattern: 'YYYY-MM-DD',
  dirname: resolve(__dirname, '..', '..', 'logs', 'app'),
  extension: '.log',
  filename: 'server.%DATE%',
  format: textFormat,
  handleExceptions: true,
  handleRejections: true,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  maxFiles: '366d',
  maxSize: '20m',
  zippedArchive: true,
  watchLog: true,
};

const logger = createLogger({
  exitOnError: true,
  levels: config.npm.levels,
  transports: [
    new transports.Console(consoleOptions),
    new transports.DailyRotateFile(dailyRotateOptions),
  ],
});

export default logger;
