import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import { feeDataSelector } from '@src/components/EstimateFee/EstimateFee.selector';
import { validator } from '@src/components/core/reduxForm';

export const enhanceMemoValidation = (WrappedComp) => (props) => {
  const { userFees } = useSelector(feeDataSelector);
  const { isMemoRequired } = userFees;
  const getMemoValidator = () => {
    if (isMemoRequired) {
      return [validator.required()];
    }
    return [];
  };
  const validateMemo = getMemoValidator();
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, validateMemo }} />
    </ErrorBoundary>
  );
};
