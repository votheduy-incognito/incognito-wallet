/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import convert from '@utils/convert';
import { tradeSelector, actionSetWarning } from '@screens/DexV2/features/Trade';
import { calculateOutputValueCrossPool } from './Form.utils';

const enhance = (WrappedComp) => (props) => {
  const {
    inputToken,
    inputValue,
    outputToken,
    outputValue,
    pair,
  } = useSelector(tradeSelector);
  const dispatch = useDispatch();
  const setWarning = (payload) => dispatch(actionSetWarning(payload));
  const calculateHalfValue = () => {
    if (
      inputToken &&
      outputToken &&
      inputValue &&
      outputValue &&
      inputValue > convert.toOriginalAmount(1, inputToken.pDecimals)
    ) {
      const halfInput = inputValue / 2;
      const halfOutput = calculateOutputValueCrossPool(
        pair,
        inputToken,
        halfInput,
        outputToken,
      );
      const exchangeRate1 = inputValue / outputValue;
      const exchangeRate2 = halfInput / halfOutput;
      const lostPercent = 1 - _.floor(exchangeRate2 / exchangeRate1, 2);
      if (lostPercent > 0.1) {
        return setWarning('This pool has low liquidity. Please note prices.');
      }
    }
    setWarning('');
  };
  React.useEffect(() => {
    calculateHalfValue();
  }, [pair, inputValue, outputValue]);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
