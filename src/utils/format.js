import convert from '@src/utils/convert';

const AmountConstantFormat = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const AmountTokenFormat = new Intl.NumberFormat('en-US');

export default {
  amountMiliConstant(amount = throw new Error('Amount is required!')) { return AmountConstantFormat.format(amount); },
  amountConstant(amount = throw new Error('Amount is required!')) { return AmountConstantFormat.format(convert.toConstant(amount)); },
  amountToken(amount = throw new Error('Amount is required!')) { return AmountTokenFormat.format(Number.parseInt(amount) || 0); },
};
