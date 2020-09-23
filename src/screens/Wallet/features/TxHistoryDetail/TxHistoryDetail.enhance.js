import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { LoadingContainer } from '@src/components/core';

const enhance = (WrappedComp) => (props) => {
  const data = useNavigationParam('data');
  const navigation = useNavigation();
  if (!data) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{ ...props, navigation, data }} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
