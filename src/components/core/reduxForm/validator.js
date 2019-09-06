import walletValidator from 'wallet-address-validator';
import accountService from '@src/services/wallet/accountService';

const messageHanlder = (message, fieldValue, inputValue) => {
  if (typeof message === 'function') {
    return message(fieldValue, inputValue);
  }
  return message && String(message);
};

const required = ({ message } = {}) => value => value ? undefined : messageHanlder(message, value) ?? 'Required';

const maxLength = (max, { message } = {}) => value =>
  value && value.length > max ? messageHanlder(message, value, max) ?? `Must be ${max} characters or less` : undefined;

const number = ({ message } = {}) => value => value && isNaN(Number(value)) ? messageHanlder(message, value) ?? 'Must be a number' : undefined;

const minValue = (min, { message } = {}) => value =>
  value && value < min ? messageHanlder(message, value, min) ?? `Must be at least ${min}` : undefined;

const maxValue = (max, { message } = {}) => value =>
  value && value > max ? messageHanlder(message, value, max) ?? `Must be less than or equal ${max}` : undefined;

const largerThan = (min, { message } = {}) => value =>
  value && value <= min ? messageHanlder(message, value, min) ?? `Must be larger than ${min}` : undefined;

const email = (value, { message } = {}) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    messageHanlder(message, value) ?? 'Invalid email address' : undefined;

const notInList = (list, { message } = {}) => value =>
  list?.includes(value) ? messageHanlder(message, value, list) ?? 'Please use another value' : undefined;

const incognitoAddress = (value, { message } = {}) => value => value && !accountService.checkPaymentAddress(value) ? messageHanlder(message, value) ?? 'Invalid address'  :undefined;

const ethAddress = (value, { message } = {}) => value => !walletValidator.validate(value, 'ETH') ? messageHanlder(message, value) ?? 'Invalid ETH address' : undefined;

const btcAddress = (value, { message } = {}) => value => !walletValidator.validate(value, 'BTC') ? messageHanlder(message, value) ?? 'Invalid BTC address' : undefined;

const bnbAddress = (value, { message } = {}) => value => {
  const regexp = new RegExp('^(t)?(bnb)([a-z0-9]{39})$'); // t(for testnet) bnb + 39 a-z0-9
  if (!regexp.test(value)) {
    return messageHanlder(message, value) ?? 'Invalid BNB address';
  }
  return undefined;
};

const bitcoinWithdrawMinAmount = largerThan(0.0005, { message: 'Amount of Bitcoin must be larger than 0.0005 BTC' });

const combinedAmount = [required(), number(), largerThan(0, { message: 'Please enter an amount greater than 0.' })];
const combinedIncognitoAddress = [required(), incognitoAddress()];
const combinedETHAddress = [required(), ethAddress()];
const combinedBTCAddress = [required(), btcAddress()];
const combinedBNBAddress = [required(), bnbAddress()];

export default {
  required,
  maxLength,
  number,
  minValue,
  maxValue,
  email,
  incognitoAddress,
  largerThan,
  combinedAmount,
  combinedIncognitoAddress,
  combinedBNBAddress,
  combinedETHAddress,
  combinedBTCAddress,
  bitcoinWithdrawMinAmount,
  ethAddress,
  btcAddress,
  notInList
};