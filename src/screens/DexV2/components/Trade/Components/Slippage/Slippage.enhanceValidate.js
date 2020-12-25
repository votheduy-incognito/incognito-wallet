import React, { useState, useEffect } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { MESSAGES } from '@screens/Dex/constants';

const enhanceValidate = WrappedComp => props => {

  const [errorSlippage, setErrorSlippage] = useState(null);

  const { slippage, minimumAmount, } = useSelector(tradeSelector);

  useEffect(() => {
    /*else if (slippage && slippage >= 6 && slippage < 100) {
      setErrorSlippage({
        warning: MESSAGES.SLIPPAGE_WARNING,
        error: ''
      });*/
    /*else if (minimumAmount && isNumber(minimumAmount) && minimumAmount < 0) {
      setErrorSlippage({
        warning: MESSAGES.SLIPPAGE_WARNING,
        error: ''
      });
    }*/
    if (slippage && (slippage < 0 || slippage >= 100)) {
      setErrorSlippage({
        warning: '',
        error: MESSAGES.SLIPPAGE_ERROR
      });
    } else {
      setErrorSlippage(null);
    }
  }, [slippage, minimumAmount]);


  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          error: errorSlippage
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceValidate;
