import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';

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

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

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