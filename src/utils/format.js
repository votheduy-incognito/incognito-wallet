import moment from 'moment';
import _ from 'lodash';
import { CONSTANT_COMMONS } from '@src/constants';
import convertUtil from './convert';

const DefaultAmountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: CONSTANT_COMMONS.AMOUNT_MAX_FRACTION_DIGITS,
});

const amountCreator = inltConfig => (amount, decimals) => {
  if (!_.isNumber(amount) || _.isNaN(amount)) {
    return amount;
  }

  let AmountFormat = DefaultAmountFormat;

  if (inltConfig) {
    AmountFormat = new Intl.NumberFormat('en-US', {
      ...inltConfig,
      maximumFractionDigits: decimals
    });
  }

  const _amount = convertUtil.toHumanAmount(amount, decimals);
  if (!Number.isFinite(_amount)) throw new Error('Can not format invalid amount');

  return AmountFormat.format(Math.max(_amount, 0));
};

const amount = amountCreator();
const amountFull = amountCreator({});

const formatDateTime = (dateTime, formatPartern) => moment(dateTime).format(formatPartern || 'DD MMM hh:mm A');
const toMiliSecond = (second) => second * 1000;
const toFixed = (number, decimals = 0) => {
  if (_.isNumber(number) && !_.isNaN(number)) {
    return number.toFixed(decimals).replace(/((\.0+)|0+)$/g, '');
  }

  return number;
};

export default {
  amount,
  amountFull,
  formatDateTime,
  toMiliSecond,
  toFixed,
};
