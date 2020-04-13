import Settings from '@src/models/settings';
import http from '../http';

export const getSettings = () => {
  return http.get('/system/configs')
    .then(data => new Settings(data));
};
