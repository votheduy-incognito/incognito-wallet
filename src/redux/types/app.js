import { genNamspace } from '@src/utils/reduxUtils';

const n = genNamspace('APP');

// define types here
const TYPES = {
  SET_STATUS: n('SET_STATUS'),
};

export default TYPES;
