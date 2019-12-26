import storageService from '@src/services/storage';
import { setTokenHeader, setRenewToken } from '@src/services/http';
import { CONSTANT_KEYS } from '@src/constants';
import { getToken as getFirebaseToken } from '@src/services/firebase';
import DeviceInfo from 'react-native-device-info';
import { getToken as getUserToken } from '@src/services/api/user';
import { CustomError, ErrorCode } from './exception';

export const getToken = async () => {
  let firebaseToken = '';
  try {
    firebaseToken = await getFirebaseToken();
  } catch (error) {
    // Use this to authenticate app for device without Google Services (Chinese Phone)
    firebaseToken = DeviceInfo.getUniqueId() + new Date().getTime();
    console.debug('Can not get firebase token');
  }
  const uniqueId = DeviceInfo.getUniqueId();
  const tokenData = await getUserToken(uniqueId, firebaseToken);
  const { token } = tokenData;

  return token;
};

// if "fresh" is true, dont use savedToken, have to get new one
export const login = async ({ fresh = false } = {}) => {
  try {
    let token;
    if (!fresh) {
      // get existed token
      token = await storageService.getItem(CONSTANT_KEYS.DEVICE_TOKEN);
    }

    // if not existed, get new one
    if (!token) {
      const newToken = await getToken();

      // save new token to device storage
      storageService.setItem(CONSTANT_KEYS.DEVICE_TOKEN, newToken);
      token = newToken;
    }

    // set the token to axios header
    setTokenHeader(token);

    return token;
  } catch (e) {
    throw new CustomError(ErrorCode.user_login_failed, { rawError: e });
  }
};

export const logout = async () => {
  storageService.clear(CONSTANT_KEYS.DEVICE_TOKEN);
};


setRenewToken(() => login({ fresh: true }));
