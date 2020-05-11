import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import withTokenSelect from '@src/components/TokenSelect/TokenSelect.enhance';

const enhance = WrappedComp => props => {
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onlyPToken: true }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
  withTokenSelect,
);
