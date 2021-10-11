import BaseLogModel from './BaseLog';
/**
 * Class to log fatal, unrecoverable erros on the application
 * @class KernelPanicLog
 * @extends BaseLogModel
 */
class KernelPanic extends BaseLogModel {
  /**
   * On instantiate Kernel Panic Log class, it's necessary to provide the table
   * to handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('kernel_panic');
  }
}

export default KernelPanic;
