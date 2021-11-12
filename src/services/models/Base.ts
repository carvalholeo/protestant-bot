import logger from '../../logs/logger';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

/**
 * Class to emulate interface at Javascript.
 * Shouldn't be instantiated.
 */
abstract class Base {
  /**
   * Use this method only when database logging is unavailable.
   * @param {string} message Message to be stored at Kernel Panic log.
   */
  async emergencyLog(message: string) {
    const logObject: LogDatabase = {
      emmiter: 'Service.emergencyLog',
      level: 'kernel_panic',
      message: message,
    };
    await logger(logObject);
  }
}

export default Base;
