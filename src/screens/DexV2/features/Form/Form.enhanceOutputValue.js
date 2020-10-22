/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import _ from 'lodash';
import formatUtils from '@utils/format';
import { MIN_PERCENT } from '@screens/DexV2/constants';
import { apiGetQuote } from '@screens/DexV2';
import { v4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import {
  tradeSelector,
  actionGettingQuote,
  actionSetMinimumAmount,
  actionSetOutputValue,
  actionsetQuote,
} from '@screens/DexV2/features/Trade';
import { calculateOutputValueCrossPool } from './Form.utils';

let currentDebounceId;

const enhance = (WrappedComp) => (props) => {
  const { onChangeField } = props;
  const dispatch = useDispatch();
  const setOutputValue = (payload) => dispatch(actionSetOutputValue(payload));
  const setOutputText = (value) => onChangeField(value, 'output');
  const setMinimumAmount = (payload) =>
    dispatch(actionSetMinimumAmount(payload));
  const setGettingQuote = (payload) => dispatch(actionGettingQuote(payload));
  const setQuote = (payload) => dispatch(actionsetQuote(payload));

  const { inputToken, inputValue, outputToken, pair } = useSelector(
    tradeSelector,
  );

  const calculateOutputValue = () => {
    const outputValue = calculateOutputValueCrossPool(
      pair,
      inputToken,
      inputValue,
      outputToken,
    );
    setOutputValue(outputValue);
    const minimumAmount = _.floor(outputValue * MIN_PERCENT);
    setMinimumAmount(minimumAmount);
    let outputText = formatUtils.amountFull(
      minimumAmount,
      outputToken.pDecimals,
    );
    if (outputValue === 0 || minimumAmount === 0 || _.isNaN(minimumAmount)) {
      outputText = 0;
    }

    setOutputText(outputText.toString());
  };

  const getQuote = async (inputToken, outputToken, value, id) => {
    try {
      setGettingQuote(true);
      const quote = await apiGetQuote({
        inputToken,
        outputToken,
        protocol: 'Kyber',
        amount: value,
      });
      if (id !== currentDebounceId) {
        return;
      }
      const { maxAmountOut: outputValue } = quote;
      const minimumAmount = outputValue;
      setOutputValue(outputValue);
      setMinimumAmount(minimumAmount);
      if (minimumAmount === 0 || isNaN(minimumAmount)) {
        setOutputText(0);
      } else {
        const outputText = formatUtils.amountFull(
          minimumAmount,
          outputToken.pDecimals,
        );
        setOutputText(outputText);
      }
      setQuote(quote);
    } catch (error) {
      setMinimumAmount(0);
      setOutputValue(0);
      setOutputText(0);
      setQuote(null);
    } finally {
      setGettingQuote(false);
    }
  };

  const debouncedGetQuote = React.useCallback(_.debounce(getQuote, 1000), []);

  React.useEffect(() => {
    if (
      inputToken &&
      outputToken &&
      inputToken.id !== outputToken.id &&
      inputValue
    ) {
      if (inputToken.address && outputToken.address) {
        const debounceId = v4();
        setGettingQuote(true);
        debouncedGetQuote(inputToken, outputToken, inputValue, debounceId);
        currentDebounceId = debounceId;
      } else {
        calculateOutputValue();
      }
    }

    if (inputToken && outputToken && !inputValue) {
      debouncedGetQuote.cancel();
      setGettingQuote(false);
      currentDebounceId = v4();
    }

    if (!inputValue) {
      setOutputValue(0);
      setOutputText(0);
      setMinimumAmount(0);
      setQuote(null);
    }
  }, [inputToken, inputValue, outputToken, pair]);

  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
