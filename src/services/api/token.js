import http from '@src/services/http';
import PToken from '@src/models/pToken';

export const getTokenList = () =>
  http.get('ptoken/list')
    .then(res => res.map(token => new PToken(token)));