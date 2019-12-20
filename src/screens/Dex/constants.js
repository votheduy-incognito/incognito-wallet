import formatUtil from '@utils/format';

export const DEX_CHAIN_ACCOUNT = {
  PaymentAddress: '15pABFiJVeh9D5uiQEhQX4SVibGGbdAVipQxBdxkmDqAJaoG1EdFKHBrNfs'
};
export const PRV_ID = '0000000000000000000000000000000000000000000000000000000000000004';
export const PRV = {
  id: PRV_ID,
  name: 'Privacy',
  symbol: 'PRV',
  pDecimals: 9,
  hasIcon: true,
  originalSymbol: 'PRV',
};

const BIG_COINS = {
  PRV: PRV_ID,
  USDT: '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
  BTC: 'b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696',
  ETH: 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f',
  BUSD: '9e1142557e63fd20dee7f3c9524ffe0aa41198c494aa8d36447d12e85f0ddce7',
  USDC: '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
  BNB: 'b2655152784e8639fa19521a7035f331eea1f1e911b2f3200a507ebb4554387b',
  DAI: '3f89c75324b46f13c7b036871060e641d996a24c09b3065835cb1d38b799d6c1',
};

export const PRIORITY_LIST = [
  BIG_COINS.PRV,
  BIG_COINS.USDT,
  BIG_COINS.USDC,
  BIG_COINS.BUSD,
  BIG_COINS.DAI,
  BIG_COINS.BTC,
  BIG_COINS.ETH,
  BIG_COINS.BNB,
];
export const WAIT_TIME = 30000;
export const SHORT_WAIT_TIME = 3000;
export const STEPS = [
  { percent: 10, step: 'Sending input token to account 1...' },
  { percent: 20, step: 'Checking balance account 1...' },
  { percent: 30, step: 'Trading...' },
  { percent: 50, step: 'Checking balance account 1...' },
  { percent: 60, step: 'Sending output token to account 2...' },
  { percent: 70, step: 'Checking balance account 2...' },
  { percent: 80, step: 'Sending token your account...' },
  { percent: 90, step: 'Removing shadow accounts...' }
];
export const MESSAGES = {
  BALANCE_INSUFFICIENT: 'Your balance is insufficient.',
  NEGATIVE_NUMBER: 'Please enter an amount greater than 0.',
  NOT_NEGATIVE_NUMBER: 'Please enter a number greater than or equal to 0.',
  GREATER_OR_EQUAL: (number, pDecimals) => `Please enter a number greater than or equal to ${formatUtil.amountFull(number, pDecimals)}.`,
  SMALLER_THAN_100: 'Please enter a number less than 100.',
  MUST_BE_NUMBER: 'Must be a positive number.',
  TRADE_ERROR: 'We seem to have hit a snag. Please initiate the trade again.',
  TRADE_SUCCESS: 'Your balance will update in a couple of minutes after the trade is finalized.',
  TRADE_SUCCESS_TITLE: 'Trade initiated',
  DEPOSIT_ERROR: 'We seem to have hit a snag. Please try making a deposit again.',
  DEPOSIT_SUCCESS: 'Funds are on the way to your pDEX account. Your balance will update in a couple of minutes.',
  DEPOSIT_SUCCESS_TITLE: 'Deposit in process',
  WITHDRAW_ERROR: 'We seem to have hit a snag. Please try withdrawing again.',
  WITHDRAW_SUCCESS: name => `Funds are on the way to ${name}. The account balance will update in a couple of minutes`,
  WITHDRAW_SUCCESS_TITLE: 'Withdrawal in process',
  NOT_ENOUGH_NETWORK_FEE: 'Your balance is currently insufficient. Please adjust your fee settings and try again.',
  NOT_ENOUGH_BALANCE_TO_TRADE: (symbol) => `You don't have enough ${symbol} to complete this trade. Please make a deposit.`,
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  TRADE: 'trade',
  ADD_LIQUIDITY: 'add liquidity',
  REMOVE_LIQUIDITY: 'remove liquidity',
  RETRY_WITHDRAW: 'Withdraw unsuccessful. Please go into withdraw detail in history to retry.',
  WITHDRAW_COMPLETED: 'Withdraw successfully. Your balance will update in a couple of minutes',
  WITHDRAW_BALANCE: 'PDexWithdraw account balance is insufficient',
  SOMETHING_WRONG: 'Something got stuck. Please make the withdrawal again.',
  PENDING_TRANSACTIONS: 'Please wait for your previous transaction to finish processing. Simply try again later.',
  WITHDRAW_PROCESS: 'Withdrawing your funds...\n\nThis may take a couple of minutes. Please do not navigate away from the app.',
  SHARE_INSUFFICIENT: 'Your share is insufficient.',
  MUST_BE_INTEGER: 'Please enter a whole positive number (not a fraction).',
  NOT_ENOUGH_NETWORK_FEE_ADD: 'Please top up PRV to cover the network fee.',
  ADD_LIQUIDITY_PROCESS: 'Adding your pair...\n\nThis may take a couple of minutes. Please do not navigate away from the app.',
  CANCEL_LIQUIDITY_PROCESS: 'Canceling your request...\n\nThis may take a couple of minutes. Please do not navigate away from the app.',
  ACCOUNT_NOT_FOUND: 'Depositing account not found.',
  NOT_ENOUGH_BALANCE_ADD: (symbol) => `Please top up ${symbol} to complete this action.`,
  TX_REJECTED: 'We seem to have hit a snag. Please try again later.',
  REMOVE_LIQUIDITY_SUCCESS_TITLE: 'Liquidity removal initiated',
  REMOVE_LIQUIDITY_SUCCESS: 'Your balance will update a couple of minutes once liquidity removal is complete.',
  ADD_LIQUIDITY_SUCCESS_TITLE: 'Adding a pair',
  ADD_LIQUIDITY_SUCCESS: 'Your pair will be listed in a couple of minutes.',
  CANCEL_ADD_LIQUIDITY_SUCCESS_TITLE: 'Cancelling your request to add a pair.',
  CANCEL_ADD_LIQUIDITY_SUCCESS: 'Your balance will update in a couple of minutes after the request is complete.',
  NO_PAIR: 'You haven\'t added any pairs yet.',
};
export const MILLISECOND = 1;
export const SECOND = 1000 * MILLISECOND;
export const MINUTE = 60 * SECOND;
export const MIN_INPUT = 1;
export const MIN_VALUE = 50;
export const MAX_WAITING_TIME = 5 * MINUTE;
export const MULTIPLY = 6;
export const REMOVE_LIQUIDITY_TX_SIZE = 20;
export const LIMIT_HISTORY = 5;
export const MIN_CANCEL_VALUE = 1;
export const MAX_LENGTH = 20;
