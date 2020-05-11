import React from 'react';
import { Clipboard } from 'react-native';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector } from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import {
  shieldSelector,
  shieldDataSelector,
} from '@screens/Shield/Shield.selector';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { ExHandler } from '@src/services/exception';
import { Toast } from '@src/components/core';

const enhance = WrappedComp => props => {
  const { isFetching, isFetched } = useSelector(shieldSelector);
  const { address } = useSelector(shieldDataSelector);
  const onCopyAddress = async () => {
    try {
      Clipboard.setString(address);
      Toast.showInfo('Copied');
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  if (isFetching || (!isFetched && !isFetching)) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, onCopyAddress }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
