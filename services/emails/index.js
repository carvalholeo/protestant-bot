// @ts-check
'use strict';

const nodemailer = require('nodemailer');
const {renderFile} = require('ejs');
const {resolve} = require('path');

const {
  ErrorLog,
  AccessLog,
} = require('../../models');
const logger = require('../../logs/logger');

const {
  EMAIL_SERVER,
  EMAIL_PORT,
  EMAIL_REQUIRE_TLS,
  EMAIL_SSL,
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  EMAIL_TO,
} = process.env;

/**
 * Function to configure the email transporter.
 * @return {nodemailer.Transporter} Returns an object with email transporter
 * configured.
 */
function transporter() {
  return nodemailer.createTransport({
    host: String(EMAIL_SERVER),
    port: Number(EMAIL_PORT),
    secure: EMAIL_SSL === 'true',
    requireTLS: EMAIL_REQUIRE_TLS === 'true',
    auth: {
      user: String(EMAIL_ADDRESS),
      pass: String(EMAIL_PASSWORD),
    },
  });
}

/**
 * Function to send the email
 * @param {JSON} data Object, which contains:
 * - name (optional)
 * - email (optional)
 * - twitter (optional)
 * - message (required)
 */
async function sendMail(data) {
  const config ={};

  try {
    const html = await renderMail(data);

    config.from = '"BotLutero 📜🔨" <leo@leocarvalho.dev>';
    config.to = `${EMAIL_TO}`;
    config.subject = 'Formulário de contato BotLutero';

    config.text = `
Contato de ${String(data.name)}, email ${data.email} e Twitter ${data.twitter}.
Mensagem: ${data.message}`;

    config.html = html;
  } catch (error) {
    const message = `Error on try to render email on EJS.
Log is ${error}`;
    await logger('error', message, new ErrorLog());
  }

  transporter().sendMail(config)
      .then(async (success) => {
        const message = `Message ${data.message} sent to contact email.
Log from Nodemailer is ${success}`;
        await logger('access', message, new AccessLog());
      })
      .catch(async (error) => {
        console.log(error)
        const message = `Error on try to send email to contact email.
Log from Nodemailer is ${error.toString()}`;
        await logger('error', message, new ErrorLog());
      });
}

/**
 * Function to render a email into HTML.
 * @param {JSON} data Object, which contains:
 * - name (optional)
 * - email (optional)
 * - twitter (optional)
 * - message (required)
 * @return {Promise<string>} Returns the email formatted to HTML
 */
async function renderMail(data) {
  return await renderFile(
      resolve(__dirname, '..', '..', 'views', 'email.ejs'), {data});
}

module.exports = {
  sendMail,
};
