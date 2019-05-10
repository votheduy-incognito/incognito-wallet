import { genNamspace } from '@src/utils/reduxUtils.js';
const n = genNamspace('WALLET');

// define types here
const TYPES = {
  SET: n('SET'),
  REMOVE: n('REMOVE'),
};

export default TYPES;