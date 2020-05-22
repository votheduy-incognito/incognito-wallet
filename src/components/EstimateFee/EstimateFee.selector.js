import { createSelector } from 'reselect';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import convert from '@src/utils/convert';
import { CONSTANT_COMMONS } from '@src/constants';

export const estimateFeeSelector = createSelector(
  state => state.estimateFee,
  estimateFee => estimateFee,
);

export const feeDataSelector = createSelector(
  estimateFeeSelector,
  selectedPrivacySeleclor.selectedPrivacy,
  selectedPrivacySeleclor.getPrivacyDataByTokenID,
  (estimateFee, selectedPrivacy) => {
    const {
      actived,
      minFeePTokenText,
      minFeePrvText,
      feePTokenText,
      feePrvText,
      maxFeePTokenText,
      maxFeePrvText,
      amount,
      amountText,
    } = estimateFee;
    const isUseTokenFee = actived !== CONSTANT_COMMONS.PRV.id;
    const feeUnit = isUseTokenFee
      ? selectedPrivacy?.externalSymbol || selectedPrivacy.symbol
      : CONSTANT_COMMONS.PRV.symbol;
    const feePDecimals = isUseTokenFee
      ? selectedPrivacy?.pDecimals
      : CONSTANT_COMMONS.PRV.pDecimals;
    return {
      isUseTokenFee,
      fee: isUseTokenFee ? feePTokenText : feePrvText,
      feeUnit,
      feeUnitByTokenId: actived,
      feePDecimals,
      minFee: isUseTokenFee ? minFeePTokenText : minFeePrvText,
      maxFee: isUseTokenFee ? maxFeePTokenText : maxFeePrvText,
      amount,
      amountText,
    };
  },
);

export const maxAmountSelector = createSelector(
  selectedPrivacySeleclor.selectedPrivacy,
  feeDataSelector,
  (selectedPrivacy, feeData) => {
    const { isUseTokenFee, fee, amountText } = feeData;
    let amount = convert.toNumber(amountText);
    if (isUseTokenFee || selectedPrivacy?.isMainCrypto) {
      const newAmount = amount - convert.toNumber(fee);
      amount = newAmount > 0 ? newAmount : 0;
    }
    return Math.max(amount, 0);
  },
);

export const minAmountSelector = createSelector(
  selectedPrivacySeleclor.selectedPrivacy,
  selectedPrivacy =>
    selectedPrivacy?.pDecimals ? 1 / 10 ** selectedPrivacy.pDecimals : 0,
);
