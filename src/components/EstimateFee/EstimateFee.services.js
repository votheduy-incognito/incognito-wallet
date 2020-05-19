import http from '@src/services/http.track_log';

export const getEstimateFeeForPToken = (
  data = {
    Prv: 0,
    TokenID: null,
  },
) => http.post('chain/estimatefee', data);
