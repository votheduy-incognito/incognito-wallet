import React, { useEffect } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { isNaN, isNumber } from 'lodash';
import { MESSAGES, MIN_INPUT } from '@screens/Dex/constants';
import convertUtil from '@utils/convert';
import { useSelector } from 'react-redux';
import { tradingFeeSelector } from '@screens/DexV2/components/Trade/TradeV2/Trade.selector';
import { COINS } from '@src/constants';

const withValidate = WrappedComp => (props) => {
  const [error, setError] = React.useState('');
  const {
    inputToken,
    inputBalance,
    inputText,
    inputFee,
    feeToken,
    fee,
    inputMin,
    prvBalance,
    inputValue
  } = props;

  const { tradingFee } = useSelector(tradingFeeSelector)();

  const validate = () => {
    try {
      const newValue = inputText;
      const min = isNumber(inputMin) ? inputMin : MIN_INPUT;
      let number = convertUtil.toNumber(inputText, true);
      if (!newValue || newValue.length === 0) {
        setError('');
      } else if (isNaN(number)) {
        if (inputFee) {
          setError(MESSAGES.GREATER(inputFee, inputToken.pDecimals));
        } else {
          setError(MESSAGES.GREATER_OR_EQUAL(min, inputToken.pDecimals));
        }
      } else {
        // inputValue
        number = convertUtil.toOriginalAmount(number, inputToken.pDecimals, inputToken.pDecimals !== 0);
        if (inputFee && inputToken && feeToken && inputToken?.id === feeToken?.id && number <= inputFee) {
          setError(MESSAGES.GREATER(inputFee, inputToken.pDecimals));
        } else if (number < min) {
          setError(MESSAGES.GREATER_OR_EQUAL(min, inputToken.pDecimals));
        } else if (!Number.isInteger(number)) {
          setError(MESSAGES.MUST_BE_INTEGER);
        } else if (inputBalance !== null && inputFee !== null && number > inputBalance) {
          setError(MESSAGES.BALANCE_INSUFFICIENT);
        } else if (
          (feeToken?.id === COINS.PRV_ID && prvBalance < fee + tradingFee)
          ||
          tradingFee > prvBalance
        ) {
          setError(MESSAGES.NOT_ENOUGH_PRV_NETWORK_FEE);
        } else if (feeToken?.id !== COINS.PRV_ID && inputBalance < inputValue + fee) {
          MESSAGES.NOT_ENOUGH_BALANCE_TO_TRADE(inputToken.symbol);
        } else {
          setError('');
        }
      }
    } catch (error) {
      console.debug('FILTER OUTPUT LIST', error);
    }
  };

  useEffect(() => {
    if (inputToken && feeToken) {
      validate();
    }
  }, [inputText, inputBalance, inputToken, feeToken, tradingFee]);

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          error,
        }}
      />
    </ErrorBoundary>
  );
};


export default withValidate;
