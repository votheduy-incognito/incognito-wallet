import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {ExHandler} from '@src/services/exception';
import {useDispatch, useSelector} from 'react-redux';
import {actionLoadAllBalance} from '@src/redux/actions/account';
import {activeFlowSelector} from '@screens/Stake/stake.selector';
import {DEPOSIT_FLOW} from '@screens/Stake/stake.constant';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const {activeFlow} = useSelector(activeFlowSelector);
  const shouldFetchBalance = activeFlow === DEPOSIT_FLOW;
  const fetchData = async () => {
    try {
      await dispatch(actionLoadAllBalance());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    if (shouldFetchBalance) {
      fetchData();
    }
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...{...props, fetchData}} />
    </ErrorBoundary>
  );
};

export default enhance;
