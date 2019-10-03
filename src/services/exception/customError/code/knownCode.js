import { codeCreator } from '../utils';
import TYPES from '../types';

const knownError = codeCreator(TYPES.KNOWN_ERROR);

/**
 * ONLY FOR KNOWN ERRORS (Errors are thrown in the app)
 */


// place error codes here
// should seperate codes by component
// format: component_code_id

const app = {
  firebase_init_failed: knownError(-8),
  network_make_request_failed: knownError(-9)
};

const estimateFee = {
  estimate_fee_with_zero_balance: knownError(-1),
};

const getStarted = {
  getStarted_can_not_create_wallet_on_existed: knownError(-10),
  getStarted_load_device_token_failed: knownError(-11)
};

const withdraw = {
  withdraw_balance_must_not_be_zero: knownError(-12),
  withdraw_gen_withdraw_address_failed: knownError(-13)
};

export default {
  ...app,
  ...estimateFee,
  ...getStarted,
  ...withdraw,
};