import http from '@src/services/http.track_log';
import Axios from 'axios';
import { CONSTANT_CONFIGS } from '@src/constants';

export const apiGetEstimateFeeFromChain = (
  data = {
    Prv: 0,
    TokenID: null,
  },
) => http.post('chain/estimatefee', data);

export const apiCheckIfValidAddressETH = (address = '') =>
  Axios.get(
    `${CONSTANT_CONFIGS.API_BASE_URL}/eta/is-eth-account?address=${address}`,
  );

export const apiCheckValidAddress = (address = '', currencyType = null) =>
  Axios.get(
    `${CONSTANT_CONFIGS.API_BASE_URL}/ota/valid/${currencyType}/${address}`,
  );
