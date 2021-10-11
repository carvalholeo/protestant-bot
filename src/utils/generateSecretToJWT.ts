import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const filePath = resolve(__dirname, '..', '..', 'SECRET_TOKEN');
const token = randomBytes(512).toString('hex');

/**
 * Function to create, regenerate and retrieve secret for JWT.
 * @param regenerate If passed as true, the secret for JWT
 * will be regenerated. It's will invalidate all sessions on system.
 * @returns Returns the token to be used in JWT.
 */
function generateSecretToJWT(regenerate: boolean = false): string {
  try {
    if (regenerate) {
      createSecretToJWT()
    }
    return readFileSync(filePath, {encoding: 'utf-8'});
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      createSecretToJWT();
      return generateSecretToJWT();
    }
    return '';
  }
}

/**
 * Internal function to generate the JWT secret file.
 */
function createSecretToJWT() {
  writeFileSync(filePath, token, {
    flag: 'w',
    encoding: 'utf-8',
    mode: '0644',
  });
}

export default generateSecretToJWT;
