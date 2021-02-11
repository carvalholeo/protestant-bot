const path = require('path');
const fs = require('fs');


/**
 * Function to log message from some point of the system.
 *
 * @param {string} logName Name of the log where you gonna store informations.
 * @param {string} message Message that will be stored in the log.
 */
function logger(logName, message) {
  const dateTime = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
  });
  try {
    const logFile = path.resolve(__dirname, `${logName}.log`);
    const additionalMessage = `${dateTime}: ${message}\n`;

    fs.appendFileSync(logFile, additionalMessage, {
      encoding: 'utf-8',
      flag: 'a',
    });
  } catch (error) {
    const logFile = path.resolve(__dirname, 'kernelPanic.log');
    const additionalMessage = `${dateTime}: ERROR: ${error.message}\n`;
    fs.appendFileSync(logFile, additionalMessage, {
      encoding: 'utf-8',
      flag: 'a',
    });

    process.exit(255);
  }
}

module.exports = logger;
