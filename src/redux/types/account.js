import { genNamspace } from '@src/utils/reduxUtils.js';
const n = genNamspace('ACCOUNT');

// define types here
const TYPES = {
  SET: n('SET'),
  SET_BULK: n('SET_BULK'),
  REMOVE_BY_NAME: n('REMOVE_BY_NAME'),
  REMOVE_ALL: n('REMOVE_ALL'),
};

export default TYPES;