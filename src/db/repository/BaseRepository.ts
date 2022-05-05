import logger from '../../services/logs/logger';

/**
 * Class to emulate interface at Javascript.
 * Shouldn't be instantiated.
 */
abstract class BaseRepository {
  /**
   * Use this method only when database logging is unavailable.
   * @param {string} message Message to be stored at Kernel Panic log.
   */
  emergencyLog(message: string) {
    logger.emerg(`${message} at Service.emergencyLog`)
  }
}

export default BaseRepository;
