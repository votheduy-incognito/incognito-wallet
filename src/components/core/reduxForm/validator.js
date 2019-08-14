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

export const paymentAddress = (value, { message } = {}) => value && !accountService.checkPaymentAddress(value) ? message ?? 'Invalid address'  :undefined;

export const bitcoinWithdrawMinAmount = largerThan(0.0005, { message: 'Amount of Bitcoin must be larger than 0.0005 BTC' });

export const combinedAmount = [required, number, largerThan(0)];
export const combinedPaymentAddress = [required, paymentAddress];

export default {
  required,
  maxLength,
  number,
  minValue,
  maxValue,
  email,
  paymentAddress,
  largerThan,
  combinedAmount,
  combinedPaymentAddress,
  bitcoinWithdrawMinAmount
};