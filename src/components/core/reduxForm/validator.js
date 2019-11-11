import walletValidator from 'wallet-address-validator';
import accountService from '@src/services/wallet/accountService';
import { CONSTANT_COMMONS } from '@src/constants';

const isSafeInteger = number => {
  const n = Number(n);

  if (Math.abs(number) > Number.MAX_SAFE_INTEGER) {
    return false;
  }

  return true;
};

const messageHanlder = (message, fieldValue, inputValue) => {
  if (typeof message === 'function') {
    return message(fieldValue, inputValue);
  }
  return message && String(message);
};

const required = ({ message } = {}) => value => {
  if (value !== undefined && value !== null) {
    if (typeof value === 'string' && String(value).trim() === '') {
      return messageHanlder(message, value) ?? 'Required';
    }
    return undefined;
  }

  return messageHanlder(message, value) ?? 'Required';
};

const maxLength = (max, { message } = {}) => value =>
  value && value.length > max ? messageHanlder(message, value, max) ?? `Must be ${max} characters or less` : undefined;

const minLength = (min, { message } = {}) => value =>
  value && value.length < min ? messageHanlder(message, value, min) ?? `Must be at least ${min} characters` : undefined;

const isInteger = ({ message } = {}) => value => value && !Number.isInteger(Number(value)) ? messageHanlder(message, value) ?? 'Must be a integer number' : undefined;

const number = ({ message } = {}) => value => {
  const number = Number(value);
  if (value && isNaN(number)) {
    return messageHanlder(message, value) ?? 'Must be a number';
  }

  if (value && !isSafeInteger(number)) {
    return messageHanlder(message, value) ?? 'Please enter a valid number';
  }

  return undefined;
};

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

const regexp = (pattern, { message } = {}) => value =>
  pattern && !pattern.test(value) ?
    messageHanlder(message, value, pattern) ?? 'Invalid data' : undefined;

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

// the same as ETH
const tomoAddress = (value, { message } = {}) => value => !walletValidator.validate(value, 'ETH') ? messageHanlder(message, value) ?? 'Invalid TOMO address' : undefined;

const combinedAmount = [
  required(),
  number(),
  minValue(CONSTANT_COMMONS.MIN_AMOUNT_REQUIRED, { message: `Please enter an amount greater than ${CONSTANT_COMMONS.MIN_AMOUNT_REQUIRED}.` })
];

const combinedNanoAmount = [
  required(),
  isInteger(),
  number(),
  minValue(1, { message: 'Please enter an amount greater than 1.' })
];

const combinedIncognitoAddress = [required(), incognitoAddress()];
const combinedETHAddress = [required(), ethAddress()];
const combinedTOMOAddress = [required(), tomoAddress()];
const combinedBTCAddress = [required(), btcAddress()];
const combinedBNBAddress = [required(), bnbAddress()];
const combinedUnknownAddress = [required(), minLength(15)];
const combinedTokenName = [required(), minLength(3), maxLength(50), regexp(/^[a-zA-Z]((\w+)?(( |-){1}\w+)?)+$/i, { message: 'Please use a valid token name (Ex: "My Token, Token-1,..").' })];
const combinedTokenSymbol = [required(), minLength(2), maxLength(10), regexp(/^[A-Z]+$/, { message: 'Please use a valid token symbol (Ex: "SYM").' })];
const combinedAccountName = [required(), minLength(1), maxLength(50), regexp(/^[a-zA-Z]((\w+)?(( |-){1}\w+)?)+$/i, { message: 'Please use a valid account name (Ex: "Cat, Account-1,..").' })];

export default {
  required,
  maxLength,
  minLength,
  number,
  minValue,
  maxValue,
  email,
  isInteger,
  incognitoAddress,
  largerThan,
  combinedAmount,
  combinedNanoAmount,
  combinedIncognitoAddress,
  combinedUnknownAddress,
  combinedBNBAddress,
  combinedETHAddress,
  combinedTOMOAddress,
  combinedBTCAddress,
  ethAddress,
  btcAddress,
  notInList,
  combinedTokenName,
  combinedTokenSymbol,
  combinedAccountName
};