import CODE from './code';

export default {
  [CODE.estimate_fee_with_zero_balance]: 'Can not calculate fee on zero balance, please check your amount.',
  [CODE.firebase_init_failed]: 'Firebase service can not run on your app, please contact us for supporting.',
  [CODE.network_make_request_failed]: 'Opps! We have a connection proplem, please check your internet.',
  [CODE.player_have_pending_transactions]: 'Player has pending transactions.',
  [CODE.api_device_id_existed]: 'This device has been registed.',
  [CODE.web_js_token_balance_is_zero]: 'Your balance is not enough.',
  [CODE.withdraw_balance_must_not_be_zero]: 'Your balance is zero, please deposit more.',
  [CODE.withdraw_gen_withdraw_address_failed]: 'Can not get withdraw address, please try again.',
  [CODE.getStarted_can_not_create_wallet_on_existed]: 'Can not create new wallet on existing wallet.',
  [CODE.wallet_can_not_create_new_wallet]: 'Sorry, we can not create new wallet, close and reopen the app can fix it.',
  [CODE.wallet_can_not_load_existed_wallet]: 'Can not open your wallet. Please re-install the application and try again.',
  [CODE.createAccount_failed]: 'Account was not created! Please try again.',
  [CODE.createAccount_existed_name]: 'You already have an account with this name. Please try another.',
  [CODE.home_load_following_token_failed]: 'Is your list token not show? Pull to reload your the list.',
  [CODE.home_load_balance_failed] : 'Refresh to reload your balance.',
  [CODE.importAccount_failed]: 'Account was not imported, please try again.',
  [CODE.importAccount_existed]: 'This account already exists on your device. Please try another.',
  [CODE.web_js_import_existed_account]: 'Please make sure this private key is valid and does not already exist on your device.',
  [CODE.node_duplicate]: 'This node already exists on your device. Please try another.',
  [CODE.node_invalid_host]: 'This address is not a valid domain or ip address. Please try another.',
  [CODE.getStarted_load_token_failed]: 'Somthing went wrong while loading data, please check your connection and try again or contact us for help.',
  [CODE.user_login_failed]: 'We have an authorization issue.',
  [CODE.daaps_invalid_daap_url]: 'Please enter a valid Dapp URL',
  [CODE.web_js_import_invalid_key]: 'Please make sure this private key is valid.'
};