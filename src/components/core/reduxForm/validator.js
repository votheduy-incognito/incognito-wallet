import walletValidator from 'wallet-address-validator';
import accountService from '@src/services/wallet/accountService';
import formatUtils from '@src/utils/format';
import convert from '@utils/convert';

const isSafeInteger = number => {
  const n = Number(n);
  return Math.abs(number) <= Number.MAX_SAFE_INTEGER;
};

const messageHanlder = (message, fieldValue, inputValue) => {
  if (typeof message === 'function') {
    return message(convert.toNumber(fieldValue), convert.toNumber(inputValue));
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

const isInteger = ({ message } = {}) => value => value && !Number.isInteger(convert.toNumber(value)) ? messageHanlder(message, value) ?? 'Must be a integer number' : undefined;

const number = ({ message } = {}) => value => {
  const number = convert.toNumber(value);
  if (value && isNaN(number)) {
    return messageHanlder(message, value) ?? 'Must be a number';
  }

  if (value && !isSafeInteger(number)) {
    return messageHanlder(message, value) ?? 'This number is too large!';
  }

  return undefined;
};

const minValue = (min, { message } = {}) => value =>
  value && value < min ? messageHanlder(message, value, min) ?? `Must be at least ${formatUtils.number(min)}` : undefined;

const maxValue = (max, { message } = {}) => value => {
  return value && convert.toNumber(value) > max ? messageHanlder(message, value, max) ?? `Must be less than or equal ${formatUtils.number(max)}` : undefined;
};
const largerThan = (min, { message } = {}) => value =>
  value && value <= min ? messageHanlder(message, value, min) ?? `Must be larger than ${formatUtils.number(min)}` : undefined;

const email = ({ message } = {}) => value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    messageHanlder(message, value) ?? 'Invalid email address' : undefined;

const notInList = (list, { message } = {}) => value =>
  list?.includes(value) ? messageHanlder(message, value, list) ?? 'Please use another value' : undefined;

const regexp = (pattern, { message } = {}) => value =>
  pattern && !pattern.test(value) ?
    messageHanlder(message, value, pattern) ?? 'Invalid data' : undefined;

const maxBytes = (max, { message } = {}) => value =>
  value && new Blob([String(value)])?.size > max ? messageHanlder(message, value, max) ?? `Must be less than or equal ${formatUtils.number(max)} bytes` : undefined;

const incognitoAddress = (value, { message } = {}) => value => value && !accountService.checkPaymentAddress(value) ? messageHanlder(message, value) ?? 'Invalid address'  :undefined;

const ethAddress = (value, { message } = {}) => value => !walletValidator.validate(value, 'ETH', 'both') ? messageHanlder(message, value) ?? 'Invalid ETH address' : undefined;

const btcAddress = (value, { message } = {}) => value => !walletValidator.validate(value, 'BTC', 'both') ? messageHanlder(message, value) ?? 'Invalid BTC address' : undefined;

const bnbAddress = (value, { message } = {}) => value => {
  const regexp = new RegExp('^(t)?(bnb)([a-z0-9]{39})$'); // t(for testnet) bnb + 39 a-z0-9
  if (!regexp.test(value)) {
    return messageHanlder(message, value) ?? 'Invalid BNB address';
  }
  return undefined;
};

// the same as ETH
const tomoAddress = (value, { message } = {}) => value => !walletValidator.validate(value, 'ETH', 'both') ? messageHanlder(message, value) ?? 'Invalid TOMO address' : undefined;

/**
 *
 * image/png, image/jpg, image/jpeg,...
 */
const fileTypes = (typeList, { message } = {}) => value => {
  if (!value) return;

  const fileType = value?.type;
  const found = typeList.find(type => {
    if (!type) return false;
    const pattern = new RegExp(`${type}$`, 'i');
    return pattern.test(fileType);
  });
  return !found ? messageHanlder(message, value, typeList) ?? `Please use a valid type (${typeList?.join(', ')})` : undefined;
};

const maxFileSize = (sizeInKBytes, { message } = {}) => value => {
  if (!value) return;
  const fileSize = Math.ceil(Number(value?.size / 1024) || 0);

  if (fileSize <= 0) {
    return 'Invalid file, please choose another file';
  }

  return fileSize > sizeInKBytes ? messageHanlder(message, value, sizeInKBytes) ?? `Please use a file smaller than ${sizeInKBytes}kb` : undefined;
};



const combinedAmount = [
  required(),
  number(),
  largerThan(0, { message: 'Please enter an amount greater than 0' })
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
const combinedTokenName = [required(), minLength(3), maxLength(50), regexp(/\w+$/i, { message: 'Please use a valid coin name (Ex: "My Coin, Coin-1,..").' })];
const combinedTokenSymbol = [required(), minLength(2), maxLength(10), regexp(/^[A-Z]+$/, { message: 'Please use a valid coin ticker (Ex: "SYM").' })];
const combinedAccountName = [required(), minLength(1), maxLength(50), regexp(/\w+$/i, { message: 'Please use a valid account name (Ex: "Cat, Account-1,..").' })];

export default {
  required,
  maxLength,
  minLength,
  maxBytes,
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
  combinedAccountName,
  fileTypes,
  maxFileSize,
};
