/* eslint-disable import/no-cycle */
import { COINS, TRADING } from '@src/constants';
import { formValueSelector } from 'redux-form';
import { createSelector } from 'reselect';
import { formName } from '@screens/DexV2/features/Form/Form';

export const tradeSelector = createSelector(
  (state) => state?.dexV2,
  (state) => state,
  (dexV2, state) => {
    const selector = formValueSelector(formName);
    const formInput = selector(state, 'input') || '';
    const formOutput = selector(state, 'output') || '';
    const inputText = formInput;
    const outputText = formOutput;
    const trade = dexV2?.trade;
    const {
      feeToken,
      inputToken,
      outputToken,
      fee,
      error,
      inputBalance,
      inputValue,
      outputValue,
      minimumAmount,
      gettingQuote,
      quote,
    } = trade;
    const isErc20 =
      inputToken &&
      outputToken &&
      !!inputToken?.address &&
      !!outputToken?.address;
    const inputFee = feeToken?.id === inputToken?.id ? fee : 0;
    const prvFee = feeToken?.id === COINS.PRV_ID ? fee : 0;
    const disabledForm =
      !!error ||
      !inputBalance ||
      !inputValue ||
      !outputValue ||
      !minimumAmount ||
      !inputText ||
      !!gettingQuote;
    const loadingInput = inputBalance === null;
    const disabledInput = inputBalance === null;
    const disabledOutput = inputBalance === null;
    const loadingOutput = gettingQuote;
    const network =
      TRADING.ERC20_NETWORK[(quote?.protocol)] || TRADING.ERC20_NETWORK['Pdex'];
    return {
      ...trade,
      inputFee,
      prvFee,
      isErc20,
      formInput,
      formOutput,
      inputText,
      outputText,
      disabledForm,
      loadingInput,
      loadingOutput,
      disabledInput,
      disabledOutput,
      network,
    };
  },
);
