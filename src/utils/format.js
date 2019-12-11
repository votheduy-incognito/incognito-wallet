import moment from 'moment';
import _ from 'lodash';
import { CONSTANT_COMMONS } from '@src/constants';
import { BigNumber } from 'bignumber.js';
import convertUtil from './convert';

const fmt = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
};

const removeTrailingZeroes = (amountString) => {
  let formattedString = amountString;
  while(formattedString.length > 0 && (
    (formattedString.includes('.') && formattedString[formattedString.length - 1] === '0') ||
      formattedString[formattedString.length - 1] === '.'
  )
  ) {
    formattedString = formattedString.slice(0, formattedString.length - 1);
  }

  return formattedString;
};

const amountCreator = (bnFormat, maxDigits) => (amount, decimals) => {
  try {
    let _maxDigits = maxDigits;

    const _amount = convertUtil.toHumanAmount(amount, decimals);
    if (!Number.isFinite(_amount)) throw new Error('Can not format invalid amount');

    // if amount is too small, do not round it
    if (_amount > 0 && _amount < 1) {
      _maxDigits = undefined;
    }

    return _amount ? removeTrailingZeroes(new BigNumber(_amount).toFormat(_maxDigits, BigNumber.ROUND_DOWN, bnFormat)) : 0;
  } catch {
    return amount;
  }
};

const amountFull = amountCreator(fmt);

const amount = amountCreator(fmt, CONSTANT_COMMONS.AMOUNT_MAX_FRACTION_DIGITS);

const formatDateTime = (dateTime, formatPattern) => moment(dateTime).format(formatPattern || 'DD MMM hh:mm A');
const toMiliSecond = (second) => second * 1000;
const toFixed = (number, decimals = 0) => {
  if (_.isNumber(number) && !_.isNaN(number)) {
    return removeTrailingZeroes(number.toFixed(decimals));
  }

  return number;
};
const formatUnixDateTime = (dateTime, formatPattern = 'MMMM DD YYYY, HH:mm') => moment.unix(dateTime).format(formatPattern);

const number = num => {
  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat() : num;
};

const numberWithNoGroupSeparator = num => {
  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat({ ...BigNumber.config().FORMAT, groupSize: 0 }) : num;
};

export default {
  amount,
  amountFull,
  formatDateTime,
  formatUnixDateTime,
  toMiliSecond,
  toFixed,
  number,
  numberWithNoGroupSeparator,
};

// console.debug('TEST REMOVE TRAILING ZEROES');
// const CASES = [
//   '100.00',
//   '100.10',
//   '202.10',
//   '100.00',
//   '100.001',
// ];
// CASES.forEach(item => console.debug(item, removeTrailingZeroes(item)));
