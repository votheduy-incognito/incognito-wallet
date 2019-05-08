import { combineReducers } from 'redux';
import sample from './sample';
import wallet from './wallet';

const rootReducer = combineReducers({
  sample,
  wallet
});

export default rootReducer;