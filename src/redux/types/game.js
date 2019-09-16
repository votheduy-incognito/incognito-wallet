import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('GAME');

// define types here
const TYPES = {
  ROLL_DICE: n('ROLL_DICE'),
  GET_CELLS_DATA: n('GET_CELLS_DATA'),
  BUY: n('BUY'),
  SELL: n('SELL'),
};

export default TYPES;
