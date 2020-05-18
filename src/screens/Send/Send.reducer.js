import {
  DEFAULT_FEE_PER_KB,
  MAX_FEE_PER_TX,
} from '@src/components/EstimateFee/EstimateFee.utils';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  CONFIGS,
  ACTION_CHOOSE_MAX_AMOUNT,
  ACTION_INIT,
} from './Send.constant';

const initialState = {
  isFetching: false,
  isFetched: false,
  error: '',
  minAmount: null,
  maxAmount: null,
  defaultType: CONFIGS.methodEstFeeByPRV,
  feeByPrv: {
    min: DEFAULT_FEE_PER_KB,
    max: MAX_FEE_PER_TX,
    fee: 0,
    type: CONFIGS.methodEstFeeByPRV,
  },
  feeByToken: {
    min: null,
    max: null,
    fee: 0,
    type: CONFIGS.methodEstFeeByToken,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED: {
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      data: { ...action.payload },
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_CHOOSE_MAX_AMOUNT: {
    return {
      ...state,
    };
  }
  case ACTION_INIT: {
    return {
      ...state,
      ...action.payload,
    };
  }
  default:
    return state;
  }
};
