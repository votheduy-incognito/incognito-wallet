import CODE from './code';

export default {
  [CODE.estimate_fee_with_zero_balance]: 'Can not calculate fee on zero balance, please check your amount.',
  [CODE.firebase_init_failed]: 'Firebase service can not run on your app, please contact us for supporting.',
  [CODE.network_make_request_failed]: 'Opps! We have a connection proplem, please check your internet.',
  [CODE.player_have_pending_transactions]: 'Player has pending transactions.',
  [CODE.api_device_id_existed]: 'This device has been registed.',
  [CODE.web_js_token_balance_is_zero]: 'Your balance is not enough.',
  [CODE.withdraw_balance_must_not_be_zero]: 'Your balance is zero, please check again.',
  [CODE.withdraw_gen_withdraw_address_failed]: 'Can not get withdraw address, please try again.',
  [CODE.getStarted_can_not_create_wallet_on_existed]: 'Can not create new wallet on existing wallet.',
  [CODE.getStarted_load_device_token_failed]: 'Can not load device token.'
};