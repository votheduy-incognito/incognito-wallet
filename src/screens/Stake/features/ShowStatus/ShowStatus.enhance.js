import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {useSelector, useDispatch} from 'react-redux';
import {ExHandler} from '@src/services/exception';
import LocalDatabase from '@src/utils/LocalDatabase';
import {activeFlowSelector} from '../../stake.selector';
import {DEPOSIT_FLOW} from '../../stake.constant';
import {actionBackupCreateStake} from '../../stake.actions';

const enhance = WrappedComp => props => {
  const {activeFlow} = useSelector(activeFlowSelector);
  const dispatch = useDispatch();
  const hanldeBackupStakeKey = async () => {
    try {
      if (activeFlow === DEPOSIT_FLOW) {
        const isBackup = await LocalDatabase.getBackupStakeKey();
        if (isBackup) {
          await dispatch(actionBackupCreateStake());
        }
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
