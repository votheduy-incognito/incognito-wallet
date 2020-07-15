import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import { persistReducer } from 'redux-persist';
import {
  ACTION_SHOW_WIZARD_FETCHING,
  ACTION_SHOW_WIZARD_FETCHED,
  ACTION_TOGGLE_FOLLOW_DEFAULT_PTOKENS,
  ACTION_TOGGLE_SHOW_WIZARD,
} from './GetStarted.constant';

const initialState = {
  showWizard: {
    isFetching: true,
    isFetched: false,
  },
  isFollowedDefaultPTokens: false,
};

const getStartedReducer = (state = initialState, action) => {
  switch (action.type) {
  case ACTION_SHOW_WIZARD_FETCHING: {
    return {
      ...state,
      showWizard: {
        ...state.showWizard,
        isFetching: true,
      },
    };
  }
  case ACTION_SHOW_WIZARD_FETCHED: {
    return {
      ...state,
      showWizard: {
        ...state.showWizard,
        isFetching: false,
        isFetched: true,
      },
    };
  }
  case ACTION_TOGGLE_SHOW_WIZARD: {
    return {
      ...state,
      showWizard: {
        ...state,
        ...action.payload,
      },
    };
  }
  case ACTION_TOGGLE_FOLLOW_DEFAULT_PTOKENS: {
    return {
      ...state,
      isFollowedDefaultPTokens: true,
    };
  }
  default:
    return state;
  }
};

const persistConfig = {
  key: 'getStarted',
  storage: AsyncStorage,
  whitelist: ['showWizard', 'isFollowedDefaultPTokens'],
  stateReconciler: autoMergeLevel2,
};

export default persistReducer(persistConfig, getStartedReducer);
