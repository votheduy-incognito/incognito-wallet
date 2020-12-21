import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import {
  actionRetryTradeInfo
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';

const enhanceRetryTradeInfo = WrappedComp => props => {

  const {
    inputText,
    onChangeInputText
  } = props;

  const dispatch = useDispatch();

  const onRetryTradeInfo = () => {
    dispatch(actionRetryTradeInfo());
    onChangeInputText && onChangeInputText(inputText);
  };

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          onRetryTradeInfo,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceRetryTradeInfo;