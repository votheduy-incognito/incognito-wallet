import { setTokenHeader } from '@src/services/http';
import { getToken as getFirebaseToken } from '@src/services/firebase';
import DeviceInfo from 'react-native-device-info';
import { getToken as getUserToken } from '@src/services/api/user';
import LocalDatabase from '@utils/LocalDatabase';
import { v4 } from 'uuid';
import { CustomError, ErrorCode } from './exception';

export const getToken = async () => {
  let firebaseToken = '';
  let uniqueId = '';
  try {
    firebaseToken = await getFirebaseToken();
  } catch (error) {
    // Use this to authenticate app for device without Google Services (Chinese Phone)
    firebaseToken = DeviceInfo.getUniqueId() + new Date().getTime();
    console.debug('Can not get firebase token');
  }

  try {
    uniqueId = (await LocalDatabase.getDeviceId()) || DeviceInfo.getUniqueId();
  } catch {
    uniqueId = v4();
  }

  const tokenData = await getUserToken(uniqueId, firebaseToken);

  await LocalDatabase.saveDeviceId(uniqueId);

  const { token } = tokenData;

  return token;
};

// if "fresh" is true, dont use savedToken, have to get new one
export const login = async () => {
  try {
    const token = await getToken();
    setTokenHeader(token);
    return token;
  } catch (e) {
    throw new CustomError(ErrorCode.user_login_failed, { rawError: e });
  }
};

global.login = login;
