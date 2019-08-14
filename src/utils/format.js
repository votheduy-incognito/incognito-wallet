import moment from 'moment';
import convertUtil from './convert';

const AmountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 9,
});
const amount = (amount = throw new Error('Amount is required!'), decimals) => {
  const _amount = convertUtil.toHumanAmount(amount, decimals);
  return AmountFormat.format(Math.max(_amount), 0);
};
const formatDateTime = (dateTime, formatPartern) => moment(dateTime).format(formatPartern || 'DD MMM hh:mm A');
const toMiliSecond = (second) => second * 1000;

export default {
  amount,
  formatDateTime,
  toMiliSecond
};
