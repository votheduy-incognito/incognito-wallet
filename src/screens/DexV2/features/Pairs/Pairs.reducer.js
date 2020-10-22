import { ACTION_FREE_TRADE_DATA } from '@screens/DexV2/features/Trade';
import {
  ACTION_FETCHING_PAIRS,
  ACTION_FETCHED_PAIRS,
  ACTION_FETCH_FAIL_PAIRS,
} from './Pairs.constant';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: {
    pairs: [],
    tokens: [],
    pairTokens: [],
    shares: [],
    erc20Tokens: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_FETCHING_PAIRS: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED_PAIRS: {
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      data: { ...action.payload },
    };
  }
  case ACTION_FETCH_FAIL_PAIRS: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_FREE_TRADE_DATA: {
    return {
      ...initialState,
    };
  }
  default:
    return state;
  }
};
