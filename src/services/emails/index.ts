import { createTransport } from 'nodemailer';
import { renderFile } from 'ejs';
import { resolve } from 'path';

import logger from '../../utils/logs/logger';

import Contact from '../../interfaces/typeDefinitions/Contact';
import ConfigEmail from '../../interfaces/typeDefinitions/ConfigEmail';

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
  return createTransport({
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
 * @param {Contact} data Object, which contains:
 * - name (optional)
 * - email (optional)
 * - twitter (optional)
 * - message (required)
 */
async function sendMail(data: Contact) {
  const config: ConfigEmail = {
    from: '',
    to: '',
    subject: '',
    text: '',
    html: '',
  };

  try {
    const html = await renderMail(data);

    config.from = '"BotLutero 📜🔨" <leo@leocarvalho.dev>';
    config.to = `${EMAIL_TO}`;
    config.subject = 'Formulário de contato BotLutero';

    config.text = `
Contato de ${String(data.name)}, email ${data.email} e Twitter ${data.twitter}.
Mensagem: ${data.message}`;

    config.html = html;
  } catch (error: any) {
    logger.error(`${error.message} at EmailService.sendMail.renderEJS.catch`);
  }

  transporter()
    .sendMail(config)
    .then((success: any) => {
      const message = `Message ${data.message} sent to contact email.
Log from Nodemailer is ${success}`;
      logger.info(`${message} at EmailService.sendMail.sendMail.then`);
    })
    .catch((error: any) => {
      console.error(error);
      const message = `Error on try to send email to contact email.
Log from Nodemailer is ${error.toString()}`;
      logger.error(`${message} at EmailService.sendMail.sendMail.catch`);
    });
}

/**
 * Function to render a email into HTML.
 * @param {Contact} data Object, which contains:
 * - name (optional)
 * - email (optional)
 * - twitter (optional)
 * - message (required)
 * @return {Promise<string>} Returns the email formatted to HTML
 */
async function renderMail(data: Contact): Promise<string> {
  return await renderFile(
    resolve(__dirname, '..', '..', 'views', 'email.ejs'),
    { data }
  );
}

export { sendMail };
