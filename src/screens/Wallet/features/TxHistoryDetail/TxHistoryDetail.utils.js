import { CONSTANT_COMMONS } from '@src/constants';
import format from '@src/utils/format';

export const getFeeFromTxHistory = (history) => {
  let fee = 0;
  let feeUnit = '';
  let formatFee = '';
  let isUseTokenFee = false;
  let feePDecimals = '';
  try {
    if (!history) {
      return;
    }
    let isIncognitoTx = !!history?.isIncognitoTx;
    if (isIncognitoTx) {
      isUseTokenFee = !!history?.feePToken;
      feeUnit = isUseTokenFee ? history?.symbol : CONSTANT_COMMONS.PRV.symbol;
      feePDecimals = isUseTokenFee
        ? history?.pDecimals
        : CONSTANT_COMMONS.PRV.pDecimals;
      fee = (isUseTokenFee ? history?.feePToken : history?.fee) || 0;
    } else {
      isUseTokenFee = !!history?.tokenFee;
      feeUnit = isUseTokenFee ? history?.symbol : CONSTANT_COMMONS.PRV.symbol;
      feePDecimals = isUseTokenFee
        ? history?.pDecimals
        : CONSTANT_COMMONS.PRV.pDecimals;
      const userFee =
        (isUseTokenFee ? history?.tokenFee : history?.privacyFee) || 0;
      const feeBurn =
        (isUseTokenFee ? history?.burnTokenFee : history?.burnPrivacyFee) || 0;
      const originalFee = feeBurn;
      fee = userFee + feeBurn + originalFee;
    }
    formatFee = fee && format.amount(fee, feePDecimals, true);
  } catch (error) {
    console.debug(error);
  }
  return {
    formatFee,
    feeUnit,
    fee,
    isUseTokenFee,
    feePDecimals,
  };
};
