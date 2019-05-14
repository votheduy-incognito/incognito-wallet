import { combineReducers } from 'redux';
import wallet from './wallet';
import account from './account';
import server from './server';

const rootReducer = combineReducers({
  account,
  wallet,
  server
});

export default rootReducer;