import http from '@src/services/http';
import {TYPE_HISTORY} from './stakeHistory.utils';

export const api = ({paymentAddress = '', page = 1, limit = 20}) =>
  http.get(
    `pool/staker/history?p_stake_address=${paymentAddress}&page=${page}&limit=${limit}&type=1,2`,
  );
