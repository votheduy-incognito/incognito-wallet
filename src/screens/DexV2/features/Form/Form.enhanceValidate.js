/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import _ from 'lodash';
import convertUtil from '@utils/convert';
import { MESSAGES, MIN_INPUT } from '@screens/Dex/constants';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetError, tradeSelector } from '@screens/DexV2/features/Trade';

const enhance = (WrappedComp) => (props) => {
  const {
    inputToken,
    inputBalance,
    inputText,
    inputFee,
    feeToken,
    inputMin,
  } = useSelector(tradeSelector);
  const dispatch = useDispatch();
  const setError = (payload) => dispatch(actionSetError(payload));
  const validate = () => {
    try {
      const newValue = inputText;
      const min = _.isNumber(inputMin) ? inputMin : MIN_INPUT;
      let number = convertUtil.toNumber(inputText);
      if (!newValue || newValue.length === 0) {
        setError('');
      } else if (_.isNaN(number)) {
        if (inputFee) {
          setError(MESSAGES.GREATER(inputFee, inputToken.pDecimals));
        } else {
          setError(MESSAGES.GREATER_OR_EQUAL(min, inputToken.pDecimals));
        }
      } else {
        number = convertUtil.toOriginalAmount(
          number,
          inputToken.pDecimals,
          inputToken.pDecimals !== 0,
        );
        if (inputFee && number <= inputFee) {
          setError(MESSAGES.GREATER(inputFee, inputToken.pDecimals));
        } else if (number < min) {
          setError(MESSAGES.GREATER_OR_EQUAL(min, inputToken.pDecimals));
        } else if (!Number.isInteger(number)) {
          setError(MESSAGES.MUST_BE_INTEGER);
        } else if (
          inputBalance !== null &&
          inputFee !== null &&
          number > inputBalance
        ) {
          setError(MESSAGES.BALANCE_INSUFFICIENT);
        } else {
          setError('');
        }
      }
    } catch (error) {
      console.debug('FILTER OUTPUT LIST', error);
    }
  };

  React.useEffect(() => {
    if (inputToken && feeToken) {
      validate();
    }
  }, [inputText, inputBalance, inputToken, feeToken]);

  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
