import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { withLayout_2 } from '@src/components/Layout';
import { compose } from 'recompose';
import { useFocusEffect } from 'react-navigation-hooks';
import withWallet from '@screens/Wallet/features/Home/Wallet.enhance';

const enhance = (WrappedComp) => (props) => {
  const {
    retryLastTxsUnshieldDecentralized,
    retryLastTxsUnshieldCentralized,
  } = props;
  useFocusEffect(
    React.useCallback(() => {
      retryLastTxsUnshieldCentralized();
      retryLastTxsUnshieldDecentralized();
    }, []),
  );
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  withWallet,
  enhance,
);
