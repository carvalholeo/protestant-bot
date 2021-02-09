'use strict';

const path = require('path');
const fs = require('fs');

function logger(logName, message) {
  try {
    const logFile = path.resolve(__dirname, `${logName}.log`);
    const dateTime = new Date().toLocaleString("pt-BR", { timeZone: 'America/Sao_Paulo' });
    const additionalMessage = `${dateTime}: ${message}\n`;

    fs.appendFileSync(logFile, additionalMessage, { encoding: 'utf-8', flag: 'a' });
  } catch (error) {
    const logFile = path.resolve(__dirname, `kernelPanic.log`);
    const dateTime = new Date().toLocaleString("pt-BR", { timeZone: 'America/Sao_Paulo' });
    const additionalMessage = `${dateTime}: ERROR: ${error.message}\n`;

    fs.appendFileSync(logFile, additionalMessage, { encoding: 'utf-8', flag: 'a' });

    process.exit(255);
  }
}

module.exports = logger;
