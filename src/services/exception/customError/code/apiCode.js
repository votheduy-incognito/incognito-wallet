import { codeCreator } from '../utils';
import TYPES from '../types';

const apiError = codeCreator(TYPES.API_ERROR);

/**
 * ONLY FOR API ERRORS
 */

// place error codes here
// should seperate codes by component
// format: component_code_id

const api = {
  api_email_invalid: apiError(-1000),
  api_email_existed: apiError(-1005),
  api_device_id_existed: apiError(-1017),
  api_invalid_arguments: apiError(-9000)
};


const game = {
  player_have_pending_transactions: apiError(-70000),
};


export default {
  ...api,
  ...game
};