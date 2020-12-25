import React, { useState, useEffect } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { tradeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { isNumber } from 'lodash';
import { MESSAGES } from '@screens/Dex/constants';

const enhanceValidate = WrappedComp => props => {

  const [errorSlippage, setErrorSlippage]     = useState(null);

  const { slippage, minimumAmount, } = useSelector(tradeSelector);

  useEffect(() => {
    if (slippage && slippage >= 100) {
      setErrorSlippage({
        warning: '',
        error: MESSAGES.SLIPPAGE_ERROR
      });
    } else if (slippage && (slippage < 0 || slippage >= 6 && slippage < 100)) {
      setErrorSlippage({
        warning: MESSAGES.SLIPPAGE_WARNING,
        error: ''
      });
    } else if (minimumAmount && isNumber(minimumAmount) && minimumAmount < 0) {
      setErrorSlippage({
        warning: MESSAGES.SLIPPAGE_WARNING,
        error: ''
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
