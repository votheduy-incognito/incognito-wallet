import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useFocusEffect } from 'react-navigation-hooks';
import { useDispatch } from 'react-redux';
import { actionFetchPairs } from './Pairs.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  useFocusEffect(
    React.useCallback(() => {
      dispatch(actionFetchPairs());
    }, []),
  );
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
