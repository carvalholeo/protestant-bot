'use strict';
// @ts-check

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
/**
 * Fucntion to create, regenerate and retrieve secret for JWT.
 * @param {Boolean} regenerate If passed as true, the secret for JWT
 * will be regenerated. It's will invalidate all sessions on system.
 * @return {String} Returns the token to be used in JWT.
 */
function generateSecretToJWT(regenerate = false) {
  const filePath = path.resolve(__dirname, '..', 'SECRET_TOKEN');
  const token = crypto.randomBytes(512).toString('hex');
  try {
    if (regenerate) {
      throw new Error('User asked for regeneration of all tokens.');
    }
    return fs.readFileSync(filePath, {encoding: 'utf-8'});
  } catch (error) {
    if (error.code === 'ENOENT' || regenerate) {
      fs.writeFileSync(filePath, token, {
        flag: 'w',
        encoding: 'utf-8',
        mode: '0644',
      });
      return generateSecretToJWT();
    }
  }
}

module.exports = generateSecretToJWT;
