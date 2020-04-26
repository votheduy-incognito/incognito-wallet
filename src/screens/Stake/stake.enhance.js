import React from 'react';
import {compose} from 'recompose';
import withHeader from '@src/components/Hoc/withHeader';
import {ExHandler} from '@src/services/exception';
import {useDispatch, useSelector} from 'react-redux';
import LoadingContainer from '@src/components/LoadingContainer';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {actionToggleModal} from '@src/components/Modal';
import {
  actionFetch,
  actionToggleGuide,
  actionChangeFLowStep,
} from './stake.actions';
import {stakeSelector} from './stake.selector';
import StakeModal from './stake.modal';
import {DEPOSIT_FLOW, STEP_FLOW} from './stake.constant';

const enhance = WrappedComp => props => {
  const dispatch = useDispatch();
  const {isFetched} = useSelector(stakeSelector);
  const fetchData = async () => {
    try {
      await dispatch(actionFetch());
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleStartStake = async () => {
    await new Promise.all([
      dispatch(
        actionToggleModal({
          data: <StakeModal />,
          visible: true,
        }),
      ),
      dispatch(
        actionChangeFLowStep({
          activeFlow: DEPOSIT_FLOW,
          step: STEP_FLOW.CHOOSE_ACCOUNT,
        }),
      ),
      dispatch(actionToggleGuide()),
    ]);
  };
  React.useEffect(() => {
    fetchData();
  }, []);
  if (!isFetched) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{...props, fetchData, handleStartStake}} />
    </ErrorBoundary>
  );
};

export default compose(
  withHeader,
  enhance,
);
