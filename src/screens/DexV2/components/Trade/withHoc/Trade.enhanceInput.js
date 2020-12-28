import React, { useEffect } from 'react';
import ErrorBoundary from '@components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import {
  actionChangeInputText as changeInputText,
  actionUpdateInputToken as updateInputToken
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import { head, isEmpty } from 'lodash';

const enhanceInput = WrappedComp => (props) => {
  const dispatch  = useDispatch();

  const {
    pairTokens,
    inputToken,
  } = props;

  const onChangeInputToken = (newInputToken) => {
    if(inputToken?.id === newInputToken?.id) return;
    dispatch(updateInputToken(newInputToken));
  };

  const onChangeInputText = (newText) => {
    dispatch(changeInputText(newText));
  };

  useEffect(() => {
    if (!isEmpty(pairTokens) && isEmpty(inputToken)) {
      onChangeInputToken(head(pairTokens));
    }
  }, [pairTokens, inputToken]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,

          onChangeInputToken,
          onChangeInputText,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhanceInput;