import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { ExHandler } from '@src/services/exception';
import { tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { removeHistory } from '@src/services/api/history';
import { Toast } from '@src/components/core';
import {
  actionFetchHistoryMainCrypto,
  actionFetchHistoryToken,
} from '@src/redux/actions/token';
import EmptyHistory from './HistoryToken.empty';

const enhance = WrappedComp => props => {
  const { isEmpty } = useSelector(tokenSeleclor.historyTokenSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const token = useSelector(
    selectedPrivacySeleclor.selectedPrivacyByFollowedSelector,
  );
  const dispatch = useDispatch();
  const handleLoadHistory = async () => {
    try {
      if (selectedPrivacy?.isMainCrypto) {
        return await dispatch(actionFetchHistoryMainCrypto());
      }
      if (!!selectedPrivacy?.isToken && !!token?.id) {
        return await dispatch(actionFetchHistoryToken());
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const handleCancelEtaHistory = async history => {
    try {
      const data = await removeHistory({
        historyId: history?.id,
        currencyType: history?.currencyType,
        isDecentralized: history?.decentralized,
      });
      if (data) {
        Toast.showSuccess('Canceled');
        await handleLoadHistory();
      }
    } catch (e) {
      new ExHandler(
        e,
        'Cancel this transaction failed, please try again.',
      ).showErrorToast();
    }
  };
  if (isEmpty) {
    return <EmptyHistory />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          handleCancelEtaHistory,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
