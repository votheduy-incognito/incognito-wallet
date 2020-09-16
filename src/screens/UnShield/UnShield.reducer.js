import { CONSTANT_KEYS } from '@src/constants';
import persistReducer from 'redux-persist/es/persistReducer';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import isArray from 'lodash/isArray';
import {
  ACTION_ADD_STORAGE_DATA_DECENTRALIZED,
  ACTION_REMOVE_STORAGE_DATA_DECENTRALIZED,
  ACTION_ADD_STORAGE_DATA_CENTRALIZED,
  ACTION_REMOVE_STORAGE_DATA_CENTRALIZED,
} from './UnShield.constant';

const initialState = {
  storage: {
    [CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED]: {
      txs: [],
    },
    [CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED]: {
      txs: [],
    },
  },
};

const unShieldReducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_ADD_STORAGE_DATA_DECENTRALIZED: {
    const { keySave, tx } = action.payload;
    const storage = state?.storage[keySave];
    const { txs } = storage;
    if (!isArray(txs) || !tx) {
      return state;
    }
    if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED) {
      return {
        ...state,
        storage: {
          ...state?.storage,
          [keySave]: {
            ...storage,
            txs: [...txs, tx],
          },
        },
      };
    }
    return state;
  }
  case ACTION_REMOVE_STORAGE_DATA_DECENTRALIZED: {
    const { keySave, burningTxId } = action.payload;
    const storage = state?.storage[keySave];
    const { txs } = storage;
    if (!isArray(txs) || !burningTxId) {
      return state;
    }
    if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_DECENTRALIZED) {
      return {
        ...state,
        storage: {
          ...state?.storage,
          [keySave]: {
            ...storage,
            txs: [...txs.filter((tx) => tx?.burningTxId !== burningTxId)],
          },
        },
      };
    }
    return state;
  }
  case ACTION_ADD_STORAGE_DATA_CENTRALIZED: {
    const { keySave, tx } = action.payload;
    const storage = state?.storage[keySave];
    const { txs } = storage;
    if (!isArray(txs) || !tx) {
      return state;
    }
    if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED) {
      return {
        ...state,
        storage: {
          ...state?.storage,
          [keySave]: {
            ...storage,
            txs: [...txs, tx],
          },
        },
      };
    }
    return state;
  }
  case ACTION_REMOVE_STORAGE_DATA_CENTRALIZED: {
    const { keySave, txId } = action.payload;
    const storage = state?.storage[keySave];
    const { txs } = storage;
    if (!isArray(txs) || !txId) {
      return state;
    }
    if (keySave === CONSTANT_KEYS.UNSHIELD_DATA_CENTRALIZED) {
      return {
        ...state,
        storage: {
          ...state?.storage,
          [keySave]: {
            ...storage,
            txs: [...txs.filter((tx) => tx?.txId !== txId)],
          },
        },
      };
    }
    return state;
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'unShield',
  storage: AsyncStorage,
  whitelist: ['storage'],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, unShieldReducer);
