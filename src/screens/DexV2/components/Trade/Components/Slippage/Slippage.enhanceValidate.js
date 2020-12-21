import React, { useState, useEffect } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { isNumber } from 'lodash';
import { MESSAGES } from '@screens/Dex/constants';

const enhanceValidate = WrappedComp => props => {

  const [messageSlippage, setMessageSlippage] = useState('');

  const {
    slippage,
    minimumAmount,
  } = useSelector(tradeSelector);

  useEffect(() => {
    if (
      (minimumAmount && isNumber(minimumAmount) && minimumAmount < 0)
      ||
      (slippage && (slippage < 0 || slippage > 100))
    ) {
      setMessageSlippage(MESSAGES.SLIPPAGE);
    } else {
      setMessageSlippage('');
    }
  }, [slippage, minimumAmount]);


  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          error: messageSlippage
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceValidate;
