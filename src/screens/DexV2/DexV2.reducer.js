import { combineReducers } from 'redux';
import { tradeReducer } from '@screens/DexV2/features/Trade';
import { historiesReducer } from '@screens/DexV2/features/Histories';
import { pairsReducer } from '@screens/DexV2/features/Pairs';

export default combineReducers({
  pairs: pairsReducer,
  trade: tradeReducer,
  histories: historiesReducer,
});
