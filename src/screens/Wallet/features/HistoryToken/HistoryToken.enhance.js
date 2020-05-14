import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { ExHandler } from '@src/services/exception';
import { tokenSeleclor } from '@src/redux/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { removeHistory } from '@src/services/api/history';
import LoadingContainer from '@src/components/LoadingContainer';
import routeNames from '@src/router/routeNames';
import { useNavigation } from 'react-navigation-hooks';
import { Button, Toast } from '@src/components/core';
import { actionFetchHistory } from '@src/redux/actions/token';
import EmptyHistory from '@src/components/HistoryList/EmptyHistory';

const enhance = WrappedComp => props => {
  const { isEmpty, isFetching } = useSelector(
    tokenSeleclor.historyTokenSelector,
  );
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLoadHistory = async () => {
    try {
      await dispatch(actionFetchHistory());
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
  const renderActionButton = () => (
    <Button
      onPress={() => {
        navigation.navigate(routeNames.Shield);
      }}
      title="Shield your crypto"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
  if (isFetching) {
    return <LoadingContainer />;
  }
  if (isEmpty) {
    return <EmptyHistory actionButton={renderActionButton()} />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          renderActionButton,
          handleCancelEtaHistory,
        }}
      />
    </ErrorBoundary>
  );
};

export default enhance;
