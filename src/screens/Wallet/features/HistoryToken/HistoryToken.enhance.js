import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { ExHandler } from '@src/services/exception';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { removeHistory } from '@src/services/api/history';
import { Toast } from '@src/components/core';
import { actionFetchHistoryToken } from '@src/redux/actions/token';
import { useHistoryList } from '@src/components/HistoryList';

const enhance = (WrappedComp) => (props) => {
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const token = useSelector(
    selectedPrivacySeleclor.selectedPrivacyByFollowedSelector,
  );

  const dispatch = useDispatch();
  const handleLoadHistory = async (refreshing, onlyReceiveHistory) => {
    try {
      if (!!selectedPrivacy?.isToken && !!token?.id) {
        dispatch(actionFetchHistoryToken(refreshing, onlyReceiveHistory));
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleCancelEtaHistory = async (history) => {
    try {
      const data = await removeHistory({
        historyId: history?.id,
        currencyType: history?.currencyType,
        isDecentralized: history?.decentralized,
      });
      if (data) {
        Toast.showSuccess('Canceled');
        handleLoadHistory(true);
      }
    } catch (e) {
      new ExHandler(
        e,
        'Cancel this transaction failed, please try again.',
      ).showErrorToast();
    }
  };

  const [showEmpty, refreshing] = useHistoryList({ handleLoadHistory });

  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleCancelEtaHistory,
          handleLoadHistory,
          showEmpty,
          refreshing,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
