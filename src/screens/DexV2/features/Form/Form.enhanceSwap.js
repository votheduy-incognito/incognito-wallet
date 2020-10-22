/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import {
  tradeSelector,
  actionSetInputToken,
  actionSetOutputToken,
} from '@screens/DexV2/features/Trade';
import { compose } from 'recompose';
import withInputValue from './Form.enhanceInputValue';

const enhance = (WrappedComp) => (props) => {
  const { onChangeInputText } = props;
  const trade = useSelector(tradeSelector);
  const dispatch = useDispatch();
  const { inputToken, outputToken, inputBalance, inputText } = trade;
  const onChangeOutputToken = (token) => dispatch(actionSetOutputToken(token));
  const onChangeInputToken = (token) => dispatch(actionSetInputToken(token));
  const handleSwapTokens = () => {
    if (!inputToken || !outputToken || inputBalance === null) {
      return;
    }
    onChangeOutputToken(inputToken);
    onChangeInputToken(outputToken);
    onChangeInputText(inputText);
  };
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onSwapTokens: handleSwapTokens }} />
    </ErrorBoundary>
  );
};

export default compose(
  withInputValue,
  enhance,
);
