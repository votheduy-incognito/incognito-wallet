import TYPES from '../types';
import { codeCreator } from '../utils';

const knownError = codeCreator(TYPES.KNOWN_ERROR);

/**
 * ONLY FOR KNOWN ERRORS (Errors are thrown in the app)
 */


// place error codes here
// should seperate codes by component
// format: component_code_id

const app = {
  firebase_init_failed: knownError(-8),
  network_make_request_failed: knownError(-9),
  wallet_can_not_create_new_wallet: knownError(-14),
  wallet_can_not_load_existed_wallet: knownError(-15),
  user_login_failed: knownError(-27)
};

const estimateFee = {
  estimate_fee_with_zero_balance: knownError(-1),
};

const getStarted = {
  getStarted_can_not_create_wallet_on_existed: knownError(-10),
  getStarted_load_token_failed: knownError(-24),
};

const withdraw = {
  withdraw_balance_must_not_be_zero: knownError(-12),
  withdraw_gen_withdraw_address_failed: knownError(-13)
};

const createAccount = {
  createAccount_failed: knownError(-16),
  createAccount_existed_name: knownError(-17)
};
const home = {
  home_load_following_token_failed: knownError(-18),
  home_load_balance_failed: knownError(-19)
};

const importAccount = {
  importAccount_failed: knownError(-20),
  importAccount_existed: knownError(-21),
};

const node = {
  node_duplicate: knownError(-22),
  node_invalid_host: knownError(-23),
};

const validator = {
  payment_address_empty: knownError(-25),
};

const staking = {
  click_stake: knownError(-26),
};

const dapps = {
  daaps_invalid_daap_url: knownError(-25)
};


export default {
  ...app,
  ...estimateFee,
  ...getStarted,
  ...withdraw,
  ...createAccount,
  ...importAccount,
  ...home,
  ...node,
  ...validator,
  ...staking,
  ...dapps
};