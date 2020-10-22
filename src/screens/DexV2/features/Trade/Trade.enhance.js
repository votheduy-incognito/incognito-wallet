/* eslint-disable import/no-cycle */
import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import withToken from './Trade.enhanceToken';
import withEstimateFee from './Trade.enhanceFee';
import withBalance from './Trade.enhanceBalance';
import withPair from './Trade.enhancePair';

const enhance = (WrappedComp) => (props) => {
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

export default compose(
  withToken,
  withEstimateFee,
  withBalance,
  withPair,
  enhance,
);
