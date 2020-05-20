import { CONSTANT_COMMONS } from '@src/constants';
import {
  ACTION_FETCHING_FEE,
  ACTION_FETCHED_FEE,
  ACTION_FETCH_FAIL_FEE,
  ACTION_ADD_FEE_TYPE,
  ACTION_CHANGE_FEE_TYPE,
  ACTION_FETCHED_PTOKEN_FEE,
  ACTION_INIT,
} from './EstimateFee.constant';
import { MAX_FEE_PER_TX } from './EstimateFee.utils';

const initialState = {
  isFetching: false,
  isFetched: false,
  fee: null,
  feePToken: null,
  types: [
    {
      tokenId: CONSTANT_COMMONS.PRV.id,
      symbol: CONSTANT_COMMONS.PRV.symbol,
    },
  ],
  actived: CONSTANT_COMMONS.PRV.id,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_INIT: {
    return {
      ...initialState,
    };
  }
  case ACTION_FETCHING_FEE: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED_FEE: {
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      fee: action.payload,
    };
  }
  case ACTION_FETCH_FAIL_FEE: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
      fee: MAX_FEE_PER_TX,
    };
  }
  case ACTION_ADD_FEE_TYPE: {
    const { tokenId } = action.payload;
    if (tokenId === CONSTANT_COMMONS.PRV.id) {
      return state;
    }
    return {
      ...state,
      types: [...initialState.types, action.payload],
    };
  }
  case ACTION_CHANGE_FEE_TYPE: {
    return {
      ...state,
      actived: action.payload,
    };
  }
  case ACTION_FETCHED_PTOKEN_FEE: {
    return {
      ...state,
      feePToken: action.payload,
    };
  }
  default:
    return state;
  }
};
