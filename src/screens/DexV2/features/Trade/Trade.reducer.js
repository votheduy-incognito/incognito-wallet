import { MAX_DEX_FEE } from '@src/components/EstimateFee/EstimateFee.utils';
import { COINS } from '@src/constants';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_SET_INPUT_TOKEN,
  ACTION_SET_OUTPUT_TOKEN,
  ACTION_SET_OUTPUT_LIST,
  ACTION_SET_FEE,
  ACTION_SET_FEE_TOKEN,
  ACTION_SET_INPUT_BALANCE,
  ACTION_SET_PRV_BALANCE,
  ACTION_SET_LAST_INPUT_TOKEN,
  ACTION_SET_LAST_ACCOUNT,
  ACTION_SET_PAIR,
  ACTION_SET_OUTPUT_VALUE,
  ACTION_SET_OUTPUT_TEXT,
  ACTION_SET_MINIMUM_AMOUNT,
  ACTION_GETTING_QUOTE,
  ACTION_SET_QUOTE,
  ACTION_SET_INPUT_VALUE,
  ACTION_SET_INPUT_TEXT,
  ACTION_SET_ERROR,
  ACTION_SET_WARNING,
  ACTION_FREE_TRADE_DATA,
} from './Trade.constant';

const initialState = {
  inputToken: null,
  inputValue: null,
  inputBalance: null,
  inputBalanceText: '',
  outputToken: null,
  outputValue: 0,
  outputList: [],
  prvBalance: null,
  lastInputToken: null,
  lastAccount: null,
  prvBalanceText: '',
  maxValue: null,
  maxValueText: '',
  fee: MAX_DEX_FEE,
  feeToken: COINS.PRV,
  minimumAmount: 0,
  gettingQuote: false,
  quote: null,
  pair: null,
  error: '',
  warning: '',
  isFetching: true,
  isFetched: false,
  data: {},
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
  case ACTION_SET_INPUT_TOKEN: {
    return {
      ...state,
      inputToken: action.payload,
    };
  }
  case ACTION_SET_OUTPUT_TOKEN: {
    return {
      ...state,
      outputToken: action.payload,
    };
  }
  case ACTION_SET_OUTPUT_LIST: {
    return {
      ...state,
      outputList: action.payload,
    };
  }
  case ACTION_SET_FEE: {
    return {
      ...state,
      fee: action.payload,
    };
  }
  case ACTION_SET_FEE_TOKEN: {
    return {
      ...state,
      feeToken: action.payload,
    };
  }
  case ACTION_SET_INPUT_BALANCE: {
    if (!action.payload) {
      return {
        ...state,
        inputBalance: initialState?.inputBalance,
        inputBalanceText: initialState?.inputBalanceText,
      };
    }
    return {
      ...state,
      inputBalance: action.payload?.inputBalance,
      inputBalanceText: action.payload?.inputBalanceText,
    };
  }
  case ACTION_SET_PRV_BALANCE: {
    return {
      ...state,
      prvBalance: action.payload,
    };
  }
  case ACTION_SET_LAST_INPUT_TOKEN: {
    return {
      ...state,
      lastInputToken: action.payload,
    };
  }
  case ACTION_SET_LAST_ACCOUNT: {
    return {
      ...state,
      lastAccount: action.payload,
    };
  }
  case ACTION_SET_PAIR: {
    return {
      ...state,
      pair: action.payload,
    };
  }
  case ACTION_SET_OUTPUT_VALUE: {
    return {
      ...state,
      outputValue: action.payload,
    };
  }
  case ACTION_SET_OUTPUT_TEXT: {
    return {
      ...state,
      outputText: action.payload,
    };
  }
  case ACTION_SET_MINIMUM_AMOUNT: {
    return {
      ...state,
      minimumAmount: action.payload,
    };
  }
  case ACTION_GETTING_QUOTE: {
    return {
      ...state,
      gettingQuote: action.payload,
    };
  }
  case ACTION_SET_QUOTE: {
    return {
      ...state,
      quote: action.payload,
    };
  }
  case ACTION_SET_INPUT_VALUE: {
    return {
      ...state,
      inputValue: action.payload,
    };
  }
  case ACTION_SET_INPUT_TEXT: {
    return {
      ...state,
      inputText: action.payload,
    };
  }
  case ACTION_SET_ERROR: {
    return {
      ...state,
      error: action.payload,
    };
  }
  case ACTION_SET_WARNING: {
    return {
      ...state,
      warning: action.payload,
    };
  }
  case ACTION_FREE_TRADE_DATA: {
    return { ...initialState };
  }
  default:
    return state;
  }
};
