import http from '../http';

export const subscribeEmail = email => http.post('/auth/subscribe', {
  Email: email,
});