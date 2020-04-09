import moment from 'moment';
import _ from 'lodash';
import { CONSTANT_COMMONS } from '@src/constants';
import { BigNumber } from 'bignumber.js';
import {getDecimalSeparator, getGroupSeparator} from '@src/resources/separator';
import convertUtil from './convert';

export const SHORT_DATE_TIME_FORMAT = 'DD MMM hh:mm A';

const removeTrailingZeroes = (amountString) => {
  let formattedString = amountString;
  while(formattedString.length > 0 && (
    (formattedString.includes(getDecimalSeparator()) && formattedString[formattedString.length - 1] === '0') ||
      formattedString[formattedString.length - 1] === getDecimalSeparator()
  )
  ) {
    formattedString = formattedString.slice(0, formattedString.length - 1);
  }

  return formattedString;
};

const amountCreator = (maxDigits) => (amount, decimals) => {
  try {
    const fmt = {
      decimalSeparator: getDecimalSeparator(),
      groupSeparator: getGroupSeparator(),
      groupSize: 3,
    };

    let _maxDigits = maxDigits;

    const _amount = convertUtil.toHumanAmount(amount, decimals);
    if (!Number.isFinite(_amount)) throw new Error('Can not format invalid amount');

    // if amount is too small, do not round it
    if (_amount > 0 && _amount < 1) {
      _maxDigits = undefined;
    }

    return _amount ? removeTrailingZeroes(new BigNumber(_amount).toFormat(_maxDigits, BigNumber.ROUND_DOWN, fmt)) : 0;
  } catch {
    return amount;
  }
};

const amountFull = amountCreator();

const amount = amountCreator(CONSTANT_COMMONS.AMOUNT_MAX_FRACTION_DIGITS);

const formatDateTime = (dateTime, formatPattern) => moment(dateTime).format(formatPattern || 'DD MMM hh:mm A');
const toMiliSecond = (second) => second * 1000;
const toFixed = (number, decimals = 0) => {
  if (_.isNumber(number) && !_.isNaN(number)) {
    return removeTrailingZeroes(number.toFixed(decimals).replace('.', getDecimalSeparator()));
  }

  return number;
};
const formatUnixDateTime = (dateTime, formatPattern = 'MMM DD YYYY, HH:mm') => moment.unix(dateTime).format(formatPattern);

const number = num => {
  const fmt = {
    decimalSeparator: getDecimalSeparator(),
    groupSeparator: getGroupSeparator(),
    groupSize: 3,
  };

  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat(fmt) : num;
};

const numberWithNoGroupSeparator = num => {
  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat({ ...BigNumber.config().FORMAT, decimalSeparator: getDecimalSeparator(), groupSize: 0 }) : num;
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
