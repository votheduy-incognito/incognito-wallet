import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import {ExHandler} from '@src/services/exception';
import {useNavigationParam, useNavigation} from 'react-navigation-hooks';
import {useDispatch} from 'react-redux';
import {
  actionRetryCreateState,
  actionChangeFLowStep,
} from '@src/screens/Stake/stake.actions';
import {
  actionFetch,
  actionRemoveStorageHistory,
} from '@screens/StakeHistory/stakeHistory.actions';
import {DEPOSIT_FLOW, STEP_FLOW} from '@src/screens/Stake/stake.constant';
import StakeModal from '@screens/Stake/stake.modal';
import {actionToggleModal} from '@src/components/Modal';
import LoadingModal from '@src/components/Modal/features/LoadingModal';

const enhance = WrappedComp => props => {
  const data = useNavigationParam('data');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleRetryDeposit = async () => {
    try {
      await dispatch(
        actionToggleModal({
          data: (
            <LoadingModal
              title={
                'Retrying your deposit…\nThis may take a couple of minutes. Please do not navigate away from the screen.'
              }
            />
          ),
          visible: true,
        }),
      );
      await dispatch(
        actionRetryCreateState({txId: data?.incognitoTx, id: data?.id}),
      );
      await Promise.all([
        await dispatch(
          actionToggleModal({
            data: <StakeModal />,
            visible: true,
          }),
        ),
        await dispatch(
          actionChangeFLowStep({
            activeFlow: DEPOSIT_FLOW,
            step: STEP_FLOW.SHOW_STATUS,
          }),
        ),
        await dispatch(actionFetch({loadmore: false})),
      ]);
    } catch (error) {
      await dispatch(actionToggleModal());
      const ex = new ExHandler(error);
      ex.toastMessageError();
      if (ex.getCodeError() === 'API_ERROR(-80002)') {
        await dispatch(actionRemoveStorageHistory(data?.id));
        return navigation.goBack();
      }
    }
  };
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          data,
          handleRetryDeposit,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
