import React, { memo } from 'react';
import HistoryList, { useHistoryList } from '@src/components/HistoryList';
import { useDispatch, useSelector } from 'react-redux';
import { tokenSeleclor } from '@src/redux/selectors';
import { actionFetchHistoryMainCrypto } from '@src/redux/actions/token';
import { ExHandler } from '@src/services/exception';
import withMainCryptoHistory from './MainCryptoHistory.enhance';
import EmptyHistory from './MainCryptoHistory.empty';

const MainCryptoHistory = () => {
  const { histories } = useSelector(tokenSeleclor.historyTokenSelector);
  const { isLoadmore, isFetching } = useSelector(
    tokenSeleclor.receiveHistorySelector,
  );
  const dispatch = useDispatch();
  const handleLoadHistory = (refreshing = false) => {
    try {
      dispatch(actionFetchHistoryMainCrypto(refreshing));
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const [showEmpty, refreshing] = useHistoryList({ handleLoadHistory });
  return (
    <HistoryList
      histories={histories}
      onRefreshHistoryList={() => handleLoadHistory(true)}
      onLoadmoreHistory={handleLoadHistory}
      refreshing={refreshing}
      isLoadmore={isLoadmore}
      loading={isFetching}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={showEmpty}
    />
  );
};

MainCryptoHistory.propTypes = {};

export default withMainCryptoHistory(memo(MainCryptoHistory));
