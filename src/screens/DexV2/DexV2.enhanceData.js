import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';

const enhance = WrappedComp => props => {
  const {
    pairs,
    tokens,
    pairTokens,
    shares,
    loadingPair,
    erc20Tokens,
    inputToken
  } = useSelector(tradeSelector);
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          pairs,
          tokens,
          pairTokens,
          shares,
          loadingPair,
          erc20Tokens,
          inputToken
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;