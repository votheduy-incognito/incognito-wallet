import storage from './storage';
import CONSTANT_KEYS from '@src/constants/keys';

export const savePassphase = password => {
  if (password && typeof password === 'string') {
    return password && storage.setItem(CONSTANT_KEYS.PASSPHASE_KEY, password);
  }
  return new Error('Password is required!'); 
};

export const getPassphase = () => storage.getItem(CONSTANT_KEYS.PASSPHASE_KEY).catch(() => new Error('Get passphase failed!'));

export const login = async ({
  password = throw new Error('Password is required!')
}) => {
  try {
    if (password) {
      const passphase = await getPassphase();
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