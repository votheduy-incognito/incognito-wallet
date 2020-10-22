/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import withInput from './Form.enhanceInput';
import withSwap from './Form.enhanceSwap';
import withOutputValue from './Form.enhanceOutputValue';
import withInputValue from './Form.enhanceInputValue';
import withValidate from './Form.enhanceValidate';
import withWarning from './Form.enhanceWarning';

const enhance = (WrappedComp) => (props) => {
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  withInput,
  withSwap,
  withInputValue,
  withOutputValue,
  withValidate,
  withWarning,
  enhance,
);
