const AmountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

export default {
  amount(amount = throw new Error('Amount is required!')) { return AmountFormat.format(amount); }
};