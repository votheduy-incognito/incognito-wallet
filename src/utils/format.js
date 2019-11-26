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

const amountCreator = (bnFormat, maxDigits) => (amount, decimals) => {
  try {
    let _maxDigits = maxDigits;

    const _amount = convertUtil.toHumanAmount(amount, decimals);
    if (!Number.isFinite(_amount)) throw new Error('Can not format invalid amount');
  
    // if amount is too small, do not round it
    if (_amount > 0 && _amount < 1) {
      _maxDigits = undefined;
    }
  
    return _amount ? new BigNumber(_amount).toFormat(_maxDigits, BigNumber.ROUND_DOWN, bnFormat) : 0;
  } catch {
    return amount;
  }  
};

const amountFull = amountCreator(fmt);

const amount = amountCreator(fmt, CONSTANT_COMMONS.AMOUNT_MAX_FRACTION_DIGITS);

const formatDateTime = (dateTime, formatPartern) => moment(dateTime).format(formatPartern || 'DD MMM hh:mm A');
const toMiliSecond = (second) => second * 1000;
const toFixed = (number, decimals = 0) => {
  if (_.isNumber(number) && !_.isNaN(number)) {
    return number.toFixed(decimals).replace(/((\.0+)|0+)$/g, '');
  }

  return number;
};

const number = num => {
  const rs = new BigNumber(num);
  return rs.isFinite() ? rs.toFormat() : num;
};


export default {
  amount,
  amountFull,
  formatDateTime,
  toMiliSecond,
  toFixed,
  number,
};
