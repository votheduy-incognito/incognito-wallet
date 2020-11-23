import includes from 'lodash/includes';
import toLower from 'lodash/toLower';
import convert from '@utils/convert';
import format from '@utils/format';

export const handleFilterTokenByKeySearch = ({ tokens, keySearch }) =>
  tokens.filter(
    (token) =>
      includes(toLower(token?.displayName), keySearch) ||
      includes(toLower(token?.name), keySearch) ||
      includes(toLower(token?.symbol), keySearch) ||
      includes(toLower(token?.pSymbol), keySearch) ||
      includes(toLower(token?.networkName), keySearch),
  );


export const formatPrice = (price, toNumber = false) => {
  const pDecimals = 9;
  const originalAmount = convert.toOriginalAmount(
    price,
    pDecimals,
    true,
  ) || 0;
  const result = format.amount(originalAmount, pDecimals);
  return toNumber ? convert.toNumber(result, true) : result;
};

export const formatAmount = (
  price,
  amount,
  pDecimals,
  togglePDecimals,
  decimalDigits,
  toNumber = false
) => {
  // format Amount to origin
  const priceFormat  = formatPrice(price, true) || 0;

  // format amount with has decimalDigits
  const formatAmount = format.amount(
    amount,
    pDecimals,
    true,
    decimalDigits
  );

  const totalAmountNumber = convert.toNumber(formatAmount, true) * priceFormat;

  const amountOriginalFormat  = convert.toOriginalAmount(
    totalAmountNumber,
    togglePDecimals,
    true,
  ) || 0;

  const amountBaseToggle = format.amount(
    amountOriginalFormat,
    togglePDecimals,
    true,
    decimalDigits,
  );

  return toNumber ? convert.toNumber(amountBaseToggle, true) : amountBaseToggle;
};

