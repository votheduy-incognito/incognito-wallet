import { persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
} from './Home.constant';

const initialState = {
  isFetching: true,
  isFetched: false,
  configs: {
    categories: [],
    headerTitle: null,
  },
  defaultConfigs: null,
};

const homeReducer = (state = initialState, action) => {
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
      configs: { ...action.payload },
      defaultConfigs: { ...action.payload },
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'home',
  storage: AsyncStorage,
  whitelist: ['defaultConfigs'],
  stateReconciler: autoMergeLevel1,
};

export default persistReducer(persistConfig, homeReducer);
