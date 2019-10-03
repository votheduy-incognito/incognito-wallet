import { codeCreator } from '../utils';
import TYPES from '../types';

const webjsError = codeCreator(TYPES.WEB_JS_ERROR);

/**
 * ONLY FOR WEBJS ERRORS
 */

// place error codes here
// should seperate codes by component
// format: component_code_id

const webJs = {
  web_js_token_balance_is_zero: webjsError(-4007),
};

export default {
  ...webJs,
};