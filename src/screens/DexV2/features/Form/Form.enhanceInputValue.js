/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import _ from 'lodash';
import convertUtil from '@utils/convert';
import formatUtil from '@utils/format';
import { useDispatch, useSelector } from 'react-redux';
import {
  tradeSelector,
  actionSetInputValue,
} from '@screens/DexV2/features/Trade';
import { compose } from 'recompose';
import withInput from './Form.enhanceInput';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  const { onChangeField } = props;
  const { inputToken, fee, feeToken, inputText } = useSelector(tradeSelector);
  const setInputValue = (payload) => dispatch(actionSetInputValue(payload));
  const changeInputText = (newText) => {
    if (newText.includes('e-')) {
      newText = formatUtil.toFixed(
        convertUtil.toNumber(newText, true),
        inputToken.pDecimals,
      );
    }
    onChangeField(newText, 'input');
    if (!newText) {
      setInputValue(0);
    }
    if (newText.toString() === 'NaN') {
      onChangeField('', 'input');
    }
  };
  React.useEffect(() => {
    if (feeToken && inputText) {
      const number = convertUtil.toNumber(inputText);
      if (!_.isNaN(number) && number > 0) {
        const originalAmount = convertUtil.toOriginalAmount(
          number,
          inputToken.pDecimals,
          inputToken.pDecimals !== 0,
        );
        const value =
          feeToken.id === inputToken.id ? originalAmount - fee : originalAmount;
        setInputValue(value);
      }
    }
  }, [fee, feeToken, inputText, inputToken]);

  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onChangeInputText: changeInputText }} />
    </ErrorBoundary>
  );
};

export default compose(
  withInput,
  enhance,
);
