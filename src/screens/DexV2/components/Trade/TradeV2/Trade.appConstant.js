import { COINS } from '@src/constants';
import { MAX_DEX_FEE } from '@components/EstimateFee/EstimateFee.utils';

export const NETWORK_FEE_PRV = {
  fee:      MAX_DEX_FEE,
  feeToken: COINS.PRV
};

export const PRIORITY_KEY = {
  MEDIUM:   'MEDIUM',
  FAST:     'FAST',
  FASTEST:  'FASTEST',
};

export const PRIORITY_PDEX = {
  MEDIUM: {
    key: PRIORITY_KEY.MEDIUM,
    number: 1,
    tradingFee: 0
  },
  FAST: {
    key: PRIORITY_KEY.FAST,
    number: 2,
    tradingFee: NETWORK_FEE_PRV.fee,
  },
  FASTEST: {
    key: PRIORITY_KEY.FASTEST,
    number: 3,
    tradingFee: NETWORK_FEE_PRV.fee * 2
  }
};

export const TRADE_LOADING_VALUE = {
  INPUT:  'INPUT',
  OUTPUT: 'OUTPUT',
};
