import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import { settingSelector } from '@screens/Setting/Setting.selector';
import { actionFetchServers } from '@screens/Setting/Setting.actions';

const enhance = (WrappedComp) => (props) => {
  const { defaultServerId } = useSelector(settingSelector);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(actionFetchServers());
  }, [defaultServerId]);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
