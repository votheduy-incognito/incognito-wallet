import moment from 'moment';
import convertUtil from './convert';

const AmountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 9,
});
const amount = (amount = throw new Error('Amount is required!'), tokenSymbol) => {
  const _amount = convertUtil.toHumanAmount(amount, tokenSymbol);
  return AmountFormat.format(Math.max(_amount), 0);
};
const formatDateTime = (dateTime, formatPartern) => moment(dateTime).format(formatPartern || 'DD/MM/YYYY - HH:mm:ss');
const toMiliSecond = (second) => second * 1000;

export default {
  amount,
  formatDateTime,
  toMiliSecond
};
