import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import {
  ACTION_CLEAR_HISTORY_DETAIL,
  ACTION_REFRESH_FAIL,
  ACTION_REFRESHED,
  ACTION_REFRESHING, ACTION_UPDATE_HISTORY_DETAIL,
} from '@screens/Wallet/features/TxHistoryDetail/TxHistoryDetail.constant';
import _ from 'lodash';

const initialState = {
  isRefreshing: false,
  historyDetail: null
};

const txHistoryDetailReducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_REFRESHING: {
    return {
      ...state,
      isRefreshing: true,
    };
  }
  case ACTION_REFRESHED: {
    const { historyDetail } = action.payload;
    return {
      ...state,
      isRefreshing: false,
      historyDetail
    };
  }
  case ACTION_REFRESH_FAIL: {
    return {
      ...state,
      isRefreshing: false,
    };
  }
  case ACTION_UPDATE_HISTORY_DETAIL: {
    const { historyDetail } = action.payload;
    return {
      ...state,
      historyDetail: historyDetail || state.historyDetail,
    };
  }
  case ACTION_CLEAR_HISTORY_DETAIL: {
    return {
      ...state,
      ...(_.cloneDeep(initialState)),
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'txHistoryDetail',
  storage: AsyncStorage,
  whitelist: [''],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, txHistoryDetailReducer);