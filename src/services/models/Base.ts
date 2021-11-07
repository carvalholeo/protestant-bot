import logger from '../../logs/logger';

/**
 * Class to emulate interface at Javascript.
 * Shouldn't be instantiated.
 */
abstract class Base {
  /**
   * Use this method only when database logging is unavailable.
   * @param {string} message Message to be stored at Kernel Panic log.
   */
  emergencyLog(message: string) {
    logger('kernel_panic', message);
  }
}

export default Base;
