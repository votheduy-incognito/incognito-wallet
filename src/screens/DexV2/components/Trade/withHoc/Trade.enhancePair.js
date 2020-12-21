import React, {useEffect} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import {
  actionGetCouplePair as getCouplePair
} from '@screens/DexV2/components/Trade/TradeV2/Trade.actions';
import { isEmpty } from 'lodash';

const enhancePair = WrappedComp => props => {
  const dispatch = useDispatch();

  const { inputToken, outputToken, pairs } = props;

  const loadCouplePair = () => {
    dispatch(getCouplePair());
  };

  useEffect(() => {
    if (isEmpty(inputToken) || isEmpty(outputToken) || isEmpty(pairs)) return;
    loadCouplePair();
  }, [inputToken, outputToken, pairs]);


  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhancePair;