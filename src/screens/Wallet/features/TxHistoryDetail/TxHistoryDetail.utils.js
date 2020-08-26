import { CONSTANT_COMMONS } from '@src/constants';
import format from '@src/utils/format';

export const getFeeFromTxHistory = (history) => {
  let fee = 0;
  let feeUnit = '';
  let formatFee = '';
  try {
    if (!history) {
      return;
    }
    let isIncognitoTx = !!history?.isIncognitoTx;
    let isUseTokenFee;
    if (isIncognitoTx) {
      isUseTokenFee = !!history?.feePToken;
      feeUnit = isUseTokenFee
        ? history?.symbol
        : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
      fee = isUseTokenFee ? history?.feePToken : history?.fee;
    } else {
      isUseTokenFee = !!history?.tokenFee;
      feeUnit = isUseTokenFee
        ? history?.symbol
        : CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;
      fee = history?.privacyFee ? history?.privacyFee : history?.tokenFee;
    }
    formatFee =
      fee &&
      format.amount(
        fee,
        isUseTokenFee
          ? history?.pDecimals
          : CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY,
      );
  } catch (error) {
    console.debug(error);
  }
  return {
    formatFee,
    feeUnit,
    fee,
  };
};
