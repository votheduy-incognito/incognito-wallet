import { combineReducers } from 'redux';
import wallet from './wallet';
import accounts from './account';

const rootReducer = combineReducers({
  accounts,
  wallet
});

export default rootReducer;