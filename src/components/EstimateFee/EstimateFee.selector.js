import { createSelector } from 'reselect';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import convert from '@src/utils/convert';
import { CONSTANT_COMMONS } from '@src/constants';
import { formValueSelector } from 'redux-form';
// eslint-disable-next-line import/no-cycle
import { formName } from './EstimateFee.input';

export const estimateFeeSelector = createSelector(
  state => state.estimateFee,
  estimateFee => estimateFee,
);

export const feeDataSelector = createSelector(
  estimateFeeSelector,
  selectedPrivacySeleclor.selectedPrivacy,
  state => state,
  selectedPrivacySeleclor.getPrivacyDataByTokenID,
  (estimateFee, selectedPrivacy, rootState, getPrivacyDataByTokenID) => {
    const prv = getPrivacyDataByTokenID(CONSTANT_COMMONS.PRV.id);
    const { actived, fee, feePToken } = estimateFee;
    const isUseTokenFee = actived !== CONSTANT_COMMONS.PRV.id;
    const feeUnit = isUseTokenFee
      ? selectedPrivacy?.externalSymbol || selectedPrivacy.symbol
      : CONSTANT_COMMONS.PRV.symbol;
    const feePDecimals = isUseTokenFee
      ? selectedPrivacy?.pDecimals
      : CONSTANT_COMMONS.PRV.pDecimals;
    const minFee = isUseTokenFee ? feePToken : fee;
    let feeConverted = minFee;
    try {
      const feeFromInput = formValueSelector(formName)(rootState, 'fee');
      feeConverted = convert.toOriginalAmount(
        convert.toNumber(feeFromInput || 0),
        feePDecimals,
      );
    } catch (error) {
      feeConverted = minFee;
    }
    return {
      isUseTokenFee,
      fee: feeConverted,
      feeUnit,
      feeUnitByTokenId: actived,
      feePDecimals,
      minFee,
      maxFee: isUseTokenFee ? selectedPrivacy?.amount : prv?.amount,
    };
  },
);

export const maxAmountSelector = createSelector(
  selectedPrivacySeleclor.selectedPrivacy,
  feeDataSelector,
  (selectedPrivacy, feeData) => {
    const { isUseTokenFee, fee } = feeData;
    let amount = selectedPrivacy?.amount || 0;
    if (isUseTokenFee || selectedPrivacy?.isMainCrypto) {
      const newAmount = amount - (fee || 0);
      amount = newAmount > 0 ? newAmount : 0;
    }
    return Math.max(
      convert.toHumanAmount(amount, selectedPrivacy?.pDecimals),
      0,
    );
  },
);

export const minAmountSelector = createSelector(
  selectedPrivacySeleclor.selectedPrivacy,
  selectedPrivacy =>
    selectedPrivacy?.pDecimals ? 1 / 10 ** selectedPrivacy.pDecimals : 0,
);
