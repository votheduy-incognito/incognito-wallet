import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('TOKEN');

// define types here
const TYPES = {
  SET: n('SET'),
  SET_BULK: n('SET_BULK'),
  GET_BALANCE: n('GET_BALANCE'),
  GET_BALANCE_FINISH: n('GET_BALANCE_FINISH'),
  REMOVE_BY_ID: n('REMOVE_BY_ID'),
  SET_LIST: n('SET_LIST'),
};

export default TYPES;