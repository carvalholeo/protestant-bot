import { resolve } from 'path';
import { appendFileSync } from 'fs';

import Log from '../interfaces/typeDefinitions/Log';

/**
 * Function to log message from some point of the system.
 *
 * @param {string} logName Name of the log where you gonna store information.
 * @param {string} message Message that will be stored in the log.
 * @param {string | Log} destination Indicate destination of the log.
 */
async function logger(logName: string, message: string, destination: Log | string = 'file') {
  const dateTime = new Date()
    .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  try {
    if (typeof (destination) === 'string') {
      const logFile = resolve(__dirname, `${logName}.log`);
      const additionalMessage = `${dateTime}: ${message}\n`;

      appendFileSync(logFile, additionalMessage, {
        encoding: 'utf-8',
        flag: 'a',
      });
    } else {
      await destination.create(message);
    }
  } catch (error: any) {
    const logFile = resolve(__dirname, 'kernelPanic.log');
    const additionalMessage = `${dateTime}: ERROR: ${error.message}\n`;
    appendFileSync(logFile, additionalMessage, {
      encoding: 'utf-8',
      flag: 'a',
    });

    process.exit(255);
  }
}

export default logger;
