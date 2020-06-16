import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { actionFetchDevices } from './Setting.actions';

const enhance = (WrappedComp) => (props) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionFetchDevices());
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
