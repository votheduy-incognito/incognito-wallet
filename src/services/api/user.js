import userModel from '@src/models/user';
import http from '../http';

export const getToken = (deviceId, deviceFirebaseToken) => {
  if (!deviceId) throw new Error('Missing device ID');
  if (!deviceFirebaseToken) throw new Error('Missing device firebase token');
  return http
    .post('/auth/new-token', {
      DeviceID: deviceId,
      DeviceToken: deviceFirebaseToken,
    })
    .then(userModel.parseTokenData);
};
