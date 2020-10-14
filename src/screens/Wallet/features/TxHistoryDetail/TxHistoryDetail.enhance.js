import React, {useEffect, useState} from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import { compose } from 'recompose';
import { withLayout_2 } from '@src/components/Layout';
import { LoadingContainer } from '@src/components/core';
import { useDispatch, useSelector } from 'react-redux';
import { walletSelector } from '@src/redux/selectors/wallet';
import { updateHistoryStatus } from '@src/services/wallet/WalletService';
import {
  selectedPrivacySeleclor,
  tokenSeleclor
} from '@src/redux/selectors';
import {
  actionFetchHistoryMainCrypto,
  actionFetchHistoryToken
} from '@src/redux/actions/token';
import { ExHandler } from '@services/exception';
import {
  getStatusData,
  getTypeData
} from '@components/HistoryList/HistoryList.utils';
import { defaultAccountSelector } from '@src/redux/selectors/account';
import appConstant from '@src/constants/app';

const FAILED = appConstant.STATUS_MESSAGE.FAILED;

const handleShowReload = (statusMessage) => {
  return FAILED === statusMessage;
};

const enhance = (WrappedComp) => (props) => {
  const wallet          = useSelector(walletSelector);
  const navigation      = useNavigation();
  const dispatch        = useDispatch();
  const account         = useSelector(defaultAccountSelector);
  const selectedPrivacy = useSelector(selectedPrivacySeleclor.selectedPrivacy);
  const token           = useSelector(selectedPrivacySeleclor.selectedPrivacyByFollowedSelector);
  const {
    histories,
    isFetching,
    isFetched,
  } = useSelector(tokenSeleclor.historyTokenSelector);

  const data                              = useNavigationParam('data');
  const [historyData, setHistoryData]     = useState(data);
  const [showReload, setShowReload]       = useState(false);

  useEffect(() => {
    if(data && !isFetching && isFetched) {
      const historyId   = data?.history?.id;
      const history = histories.find(history => history.id === historyId);
      const { statusMessage, statusColor } = getStatusData(history);
      const { typeText } = getTypeData(
        history.type,
        history,
        account?.paymentAddress,
      );
      setHistoryData({
        history,
        statusMessage,
        statusColor,
        typeText
      });
      setShowReload(handleShowReload(statusMessage));
    } else {
      setHistoryData(data);
      setShowReload(handleShowReload(data?.statusMessage));
    }
  }, [isFetching, isFetched, histories, data]);

  const handleFetchHistory = async () => {
    try {
      if (selectedPrivacy?.isMainCrypto) {
        await dispatch(actionFetchHistoryMainCrypto());
      }
      if (!!selectedPrivacy?.isToken && !!token?.id) {
        await dispatch(actionFetchHistoryToken());
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  const onRetryHistoryStatus = async () => {
    try {
      const txId  = historyData?.history?.incognitoTxID;
      if (txId) {
        await updateHistoryStatus(wallet, txId);
        await handleFetchHistory();
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };

  if (!data) {
    return <LoadingContainer />;
  }
  return (
    <ErrorBoundary>
      <WrappedComp {...{
        ...props,
        navigation,
        data: historyData,
        onRetryHistoryStatus,
        showReload,
        fetchingHistory: isFetching
      }}
      />
    </ErrorBoundary>
  );
};

export default compose(
  withLayout_2,
  enhance,
);
