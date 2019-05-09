import { combineReducers } from 'redux';
import wallet from './wallet';
import account from './account';

const rootReducer = combineReducers({
  account,
  wallet
});

export default rootReducer;