import { Toast } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import { clearPassword, getPassphrase } from './wallet/passwordService';

export const login = async ({
  password = new Error('Password is required!')
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

export const logout = async ({ navigation }) => {
  try {
    await clearPassword();
    navigation.navigate(ROUTE_NAMES.RootSplash);
  } catch {
    Toast.showError('Logout failed!');
  }
};
