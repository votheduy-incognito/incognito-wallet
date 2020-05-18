export const ACTION_FETCHING = '[send] Fetching data';
export const ACTION_FETCHED = '[send] Fetched data';
export const ACTION_FETCH_FAIL = '[send] Fetch fail data';
export const ACTION_CHOOSE_MAX_AMOUNT = '[send] Choose max amount';
export const ACTION_INIT = '[send] Action init';

export const CONFIGS = {
  formName: 'sendForm',
  formFields: {
    amount: 'amount',
    address: 'address',
    fee: 'fee',
    memo: 'memo',
  },
  testIds: {
    BALANCE: 'balance',
    TOKEN_SYMBOL: 'token-symbol',
    ADDRESS_INPUT: 'address-input',
    AMOUNT_INPUT: 'amount-input',
    MEMO_INPUT: 'memo-input',
    SUBMIT_BUTTON: 'submit-btn',
    ADDRESS_BOOK_ICON: 'address-book-icon',
    QR_CODE_ICON: 'qr-code-icon',
    MAX_BUTTON: 'max-button',
  },
  methodEstFeeByPRV: 'feeByPrv',
  methodEstFeeByToken: 'feeByToken',
};
