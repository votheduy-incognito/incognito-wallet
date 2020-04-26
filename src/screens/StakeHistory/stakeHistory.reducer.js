import AsyncStorage from '@react-native-community/async-storage';
import persistReducer from 'redux-persist/es/persistReducer';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_CHANGE_PAGE,
  ACTION_UPDATE_STORAGE_HISTORY,
  ACTION_REMOVE_STORAGE_HISTORY,
  ACTION_CLEAN_STORAGE_HISTORY,
} from './stakeHistory.constant';
import {standardizeData} from './stakeHistory.utils';

const initialState = {
  isFetching: false,
  isFetched: false,
  data: {
    limit: 20,
    page: 1,
    items: [],
    over: false,
  },
  storage: {
    history: [],
  },
};

const stakeHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_FETCHING: {
    return {
      ...state,
      isFetching: true,
    };
  }
  case ACTION_FETCHED: {
    const {items} = action.payload;
    return {
      ...state,
      isFetching: false,
      isFetched: true,
      data: {...state.data, ...action.payload},
      storage: {
        ...state.storage,
        history: [
          ...state.storage.history.filter(
            historyItem =>
              ![...items].some(
                item => item?.incognitoTx === historyItem?.incognitoTx,
              ),
          ),
        ],
      },
    };
  }
  case ACTION_FETCH_FAIL: {
    return {
      ...state,
      isFetched: false,
      isFetching: false,
    };
  }
  case ACTION_CHANGE_PAGE: {
    const page = action.payload;
    return {
      ...state,
      data: {
        ...state.data,
        page,
      },
    };
  }
  case ACTION_UPDATE_STORAGE_HISTORY: {
    const item = standardizeData(action.payload);
    return {
      ...state,
      storage: {
        ...state.storage,
        history: [...state.storage.history, item],
      },
    };
  }
  case ACTION_REMOVE_STORAGE_HISTORY: {
    const id = action.payload;
    if (!id) {
      return state;
    }
    return {
      ...state,
      storage: {
        ...state.storage,
        history: [...state.storage.history.filter(item => item?.id !== id)],
      },
    };
  }
  case ACTION_CLEAN_STORAGE_HISTORY: {
    return {
      ...state,
      storage: {
        ...state.storage,
        history: [],
      },
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'stakeHistory',
  storage: AsyncStorage,
  whitelist: ['storage'],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, stakeHistoryReducer);
