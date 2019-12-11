import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('DEX');

// define types here
const TYPES = {
  GET_HISTORIES: n('GET_HISTORIES'),
  GET_HISTORY_STATUS: n('GET_HISTORY_STATUS'),
  ADD_HISTORY: n('ADD_HISTORY'),
  UPDATE_HISTORY: n('UPDATE_HISTORY'),
  DELETE_HISTORY: n('DELETE_HISTORY'),
};

export default TYPES;
