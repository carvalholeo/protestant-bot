import {resolve} from 'path';
import {appendFileSync, WriteFileOptions} from 'fs';

import LogDatabase from '../interfaces/typeDefinitions/LogDatabase';
import {LogService} from '../services/models';

const FILE_CONFIG: WriteFileOptions = {
  encoding: 'utf-8',
  flag: 'a',
};

/**
 * Function to log message from some point of the system.
 *
 * @param {LogDatabase} logObject Object with three informations:
 * - level: level of the information to be stored
 * - emmiter: which method or function emmited the message
 * - message: message to be stored at database
 * @param {boolean} isToDatabase Indicate if the message is gonna to database
 * or to a file log. Default is ```true```, to go to database.
 */
async function logger(logObject: LogDatabase, isToDatabase: boolean = true) {
  const dateTime = new Date();
  try {
    if (isToDatabase) {
      const log = new LogService();
      await log.create(logObject);
      return;
    }

    const logFile = resolve(__dirname, `${logObject.level}.log`);
    const additionalMessage = `${dateTime}: ${logObject.emmiter} - ${logObject.message}\n`;

    appendFileSync(logFile, additionalMessage, FILE_CONFIG);
  } catch (error: any) {
    const logFile = resolve(__dirname, 'kernelPanic.log');
    const additionalMessage = `${dateTime}: ERROR: ${error.message}\n`;

    appendFileSync(logFile, additionalMessage, FILE_CONFIG);
  }
}

export default logger;
