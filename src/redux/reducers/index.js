import { combineReducers } from 'redux';
import wallet from './wallet';
import account from './account';
import server from './server';
import token from './token';
import selectedPrivacy from './selectedPrivacy';

const rootReducer = combineReducers({
  account,
  wallet,
  server,
  token,
  selectedPrivacy
});

export default rootReducer;