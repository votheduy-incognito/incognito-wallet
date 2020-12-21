import React, { useEffect } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import {tradeSelector} from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import {
  actionChangeSlippage as changeSlippage,
  actionUpdateSlippage as updateSlippage,
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import convert from '@utils/convert';

const enhanceSlippage = WrappedComp => props => {

  const dispatch = useDispatch();

  const {
    slippageText,
    slippage,
    lastUsedSlippage,
    loadingBox
  } = useSelector(tradeSelector);

  const onChangeSlippage = (newText) => {
    // update slippage Text
    const params = { slippageText: newText };
    const newValue = convert.toNumber(newText, true);
    if (!isNaN(newValue) && newValue !== slippage) {
      params.slippage = newValue;
    }
    dispatch(updateSlippage(params));
  };

  useEffect(() => {
    // calculator output when slippage have difference
    if (slippage !== lastUsedSlippage) {
      dispatch(changeSlippage(slippage, lastUsedSlippage));
    }
  }, [slippage, lastUsedSlippage]);


  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          slippageText,
          loadingBox,

          onChangeSlippage,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceSlippage;