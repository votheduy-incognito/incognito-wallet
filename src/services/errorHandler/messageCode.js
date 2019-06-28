const code = {
  api_general: Symbol(),
  api_email_invalid: Symbol(),
  api_email_existed: Symbol(),
  general: Symbol(),
  can_not_create_wallet_on_existed: Symbol(),
  create_wallet_failed: Symbol(),
  load_existed_wallet_failed: Symbol(),
  initialing_wallet_failed: Symbol(),
};

const message = {
  // error from API (backend)
  [code.api_general]: 'Opps! Something went wrong.',
  [code.api_email_invalid]: 'Please enter a valid email.',
  [code.api_email_existed]: 'This email was existed, please try another.',

  // app
  [code.general]: 'Opps! Something went wrong.',
  [code.can_not_create_wallet_on_existed]: 'Can not create new wallet on existing wallet',
  [code.create_wallet_failed]: 'Can not create your wallet, please try again.',
  [code.load_existed_wallet_failed]: 'Can not load existed wallet.',
  [code.initialing_wallet_failed]: 'Initialing wallet failed, please open it again.'
};

export default {
  code,
  message
};