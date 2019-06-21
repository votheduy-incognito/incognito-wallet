import { combineReducers } from 'redux';
import wallet from './wallet';
import account from './account';
import server from './server';
import token from './token';

const rootReducer = combineReducers({
  account,
  wallet,
  server,
  token
});

export default rootReducer;