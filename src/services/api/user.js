import userModel from '@src/models/user';
import http from '../http';

// export const subscribeEmail = email => http.post('/auth/subscribe', {
//   Email: email,
// });

// export const getTokenFromEmail = email => http.post('/auth/token', {
//   Email: email,
// });

export const getToken = deviceId => {
  return http.post('/auth/new-token', { DeviceID: deviceId})
    .then(userModel.parseTokenData);
};