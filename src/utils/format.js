import moment from 'moment';
import { CONSTANT_COMMONS } from '@src/constants';
import convertUtil from './convert';

const DefaultAmountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: CONSTANT_COMMONS.AMOUNT_MAX_FRACTION_DIGITS,
});

const amountCreator = inltConfig => (amount = throw new Error('Amount is required!'), decimals) => {
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

export default {
  amount,
  amountFull,
  formatDateTime,
  toMiliSecond
};
