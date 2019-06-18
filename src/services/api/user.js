import http from '../http';

export const subscribeEmail = email => http.post('/auth/subscribe', {
  Email: email,
});

export const getTokenFromEmail = email => http.post('/auth/token', {
  Email: email,
});