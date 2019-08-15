import walletValidator from 'wallet-address-validator';
import accountService from '@src/services/wallet/accountService';

export const required = (value, { message } = {}) => value ? undefined : message ?? 'Required';

export const maxLength = (max, { message } = {}) => value =>
  value && value.length > max ? message ?? `Must be ${max} characters or less` : undefined;

export const number = (value, { message } = {}) => value && isNaN(Number(value)) ? message ?? 'Must be a number' : undefined;

export const minValue = (min, { message } = {}) => value =>
  value && value < min ? message ?? `Must be at least ${min}` : undefined;

export const maxValue = (max, { message } = {}) => value =>
  value && value > max ? message ?? `Must be less than or equal ${max}` : undefined;

export const largerThan = (min, { message } = {}) => value =>
  value && value <= min ? message ?? `Must be larger than ${min}` : undefined;

export const email = (value, { message } = {}) =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
    message ?? 'Invalid email address' : undefined;

export const incognitoAddress = (value, { message } = {}) => value && !accountService.checkPaymentAddress(value) ? message ?? 'Invalid address'  :undefined;

export const ethAddress = (value, { message } = {}) => !walletValidator.validate(value, 'ETH') ? message ?? 'Invalid ETH address' : undefined;

export const btcAddress = (value, { message } = {}) => !walletValidator.validate(value, 'BTC') ? message ?? 'Invalid BTC address' : undefined;

export const bitcoinWithdrawMinAmount = largerThan(0.0005, { message: 'Amount of Bitcoin must be larger than 0.0005 BTC' });

export const combinedAmount = [required, number, largerThan(0)];
export const combinedIncognitoAddress = [required, incognitoAddress];
export const combinedETHAddress = [required, ethAddress];
export const combinedBTCAddress = [required, btcAddress];

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
  combinedETHAddress,
  combinedBTCAddress,
  bitcoinWithdrawMinAmount,
  ethAddress,
  btcAddress
};