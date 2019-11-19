import formatUtil from '@utils/format';

export const DEX_CHAIN_ACCOUNT = {
  PaymentAddress: '15pABFiJVeh9D5uiQEhQX4SVibGGbdAVipQxBdxkmDqAJaoG1EdFKHBrNfs'
};
export const PRV_ID = '0000000000000000000000000000000000000000000000000000000000000004';
export const PRV = {
  id: PRV_ID,
  name: 'PRV',
  symbol: 'PRV',
  pDecimals: 9,
  hasIcon: true,
  originalSymbol: 'PRV',
};
export const WAIT_TIME = 30000;
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
};
export const MIN_INPUT = 1;
export const MIN_VALUE = 10;
