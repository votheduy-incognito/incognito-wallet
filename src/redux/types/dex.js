import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('DEX');

// define types here
const TYPES = {
  GET_HISTORIES: n('GET_HISTORIES'),
  GET_HISTORY_STATUS: n('GET_HISTORY_STATUS'),
  ADD_HISTORY: n('ADD_HISTORY'),
};

export default TYPES;
