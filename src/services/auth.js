import { getPassphrase } from '@src/services/wallet/passwordService';

export const login = async ({
  password = throw new Error('Password is required!')
}) => {
  try {
    if (password) {
      const passphase = await getPassphrase();
      if (passphase === password) {
        return true;
      }
      throw new Error('Wrong password');
    }
    throw new Error('Password is required!');
  } catch {
    throw new Error('Login failed!');
  }
};