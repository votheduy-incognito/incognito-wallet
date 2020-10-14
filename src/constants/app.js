const STATUS = {
  INIT: 'INIT',
  READY: 'READY',
  WALLET_IS_NOT_LOADED: 'WALLET_IS_NOT_LOADED',
  ACCOUNT_IS_NOT_LOADED: 'ACCOUNT_IS_NOT_LOADED'
};

const DISABLED = {
  APP:        'app',
  TRADE:      'trade',
  BUY_NODE:   'buynode'
};

const STATUS_MESSAGE = {
  PENDING:    'Pending',
  COMPLETE:   'Complete',
  FAILED:     'Failed',
  EXPIRED:    'Expired'
};

export default {
  STATUS,
  DISABLED,
  STATUS_MESSAGE
};
