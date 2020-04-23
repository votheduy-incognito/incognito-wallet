import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useSelector, useDispatch} from 'react-redux';
import {ExHandler} from '@src/services/exception';
import {
  activeFlowSelector,
  storageStakeSelector,
} from '@screens/Stake/stake.selector';
import {DEPOSIT_FLOW} from '@screens/Stake/stake.constant';
import {actionBackupCreateStake} from '@screens/Stake/stake.actions';

const enhance = WrappedComp => props => {
  const {activeFlow} = useSelector(activeFlowSelector);
  const {backup} = useSelector(storageStakeSelector);
  const dispatch = useDispatch();
  const hanldeBackupStakeKey = async () => {
    try {
      if (activeFlow === DEPOSIT_FLOW && !backup) {
        await dispatch(actionBackupCreateStake());
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  React.useEffect(() => {
    hanldeBackupStakeKey();
  }, []);
  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
