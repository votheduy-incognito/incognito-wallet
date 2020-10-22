import { ACTION_FREE_TRADE_DATA } from '@screens/DexV2/features/Trade';
import {
  ACTION_SET_LOADING,
  ACTION_SET_HISTORIES,
  ACTION_SET_PAGE,
} from './Histories.constant';

const initialState = {
  loading: false,
  histories: [],
  page: 1,
};

export default (state = initialState, action) => {
  switch (action.type) {
  case ACTION_SET_LOADING: {
    return {
      ...state,
      loading: action.payload,
    };
  }
  case ACTION_SET_HISTORIES: {
    return {
      ...state,
      histories: action.payload,
    };
  }
  case ACTION_SET_PAGE: {
    return {
      ...state,
      page: action.payload,
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
