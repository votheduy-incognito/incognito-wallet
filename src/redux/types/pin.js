import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('PIN');

// define types here
const TYPES = {
  UPDATE: n('NEW'),
  DELETE: n('DELETE'),
};

export default TYPES;
