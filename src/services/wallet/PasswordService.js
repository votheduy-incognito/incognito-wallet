import CryptoJS from 'crypto-js';
import storage from '@src/services/storage';
const PASSWORD_DURATION_IN_MS = 7 * 24 * 3600 * 1000; // 7 days
const PASSWORD_SECRET_KEY = 'FJexuTITEw';

export function clearPassword() {
  storage.removeItem('passphrase');
}

export async function getPassphrase() {
  try {
    let pass = await storage.getItem('passphrase');
    if (!pass) return;
    pass = CryptoJS.AES.decrypt(pass, PASSWORD_SECRET_KEY).toString(
      CryptoJS.enc.Utf8
    );
    const [password, expired] = pass.split(':');
    if (!password || !expired) return;
  
    if (Date.now() > parseInt(expired, 10)) {
      return;
    }
    return password;
  } catch (e) {
    return;
  }
}

export async function hasPassword() {
  return !!await getPassphrase();
}

export function savePassword(pass) {
  const expired = Date.now() + PASSWORD_DURATION_IN_MS;
  const toBeSaved = CryptoJS.AES.encrypt(
    `${pass}:${expired}`,
    PASSWORD_SECRET_KEY
  ).toString();
  storage.setItem('passphrase', toBeSaved);
}
