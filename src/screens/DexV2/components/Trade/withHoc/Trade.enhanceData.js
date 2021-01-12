import React, {useMemo} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { TRADE_LOADING_VALUE } from '@screens/DexV2/components/Trade/TradeV2/Trade.appConstant';

const enhanceData = WrappedComp => props => {

  const {
    inputToken,
    inputText,
    inputValue,

    outputToken,
    outputList,
    minimumAmount,
    quote,
    loadingBox,
    outputText,
    pair,

    fee,
    feeToken,
    isErc20,

    inputBalance,
    inputBalanceText,
    prvBalance,
    lastInputToken,
    lastAccount
  } = useSelector(tradeSelector);

  const disableButton = useMemo(() => {
    return {
      disableInput: inputBalance === null || (loadingBox && loadingBox === TRADE_LOADING_VALUE.INPUT),
      disableOutput: inputBalance === null || (loadingBox && loadingBox === TRADE_LOADING_VALUE.OUTPUT)
    };
  }, [inputBalance, loadingBox]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          disableButton,

          inputToken,
          inputText,
          inputValue,

          outputToken,
          outputList,
          outputText,
          minimumAmount,
          quote,
          loadingBox,

          pair,
          fee,
          feeToken,
          isErc20,

          inputBalance,
          inputBalanceText,
          prvBalance,
          lastInputToken,
          lastAccount
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceData;