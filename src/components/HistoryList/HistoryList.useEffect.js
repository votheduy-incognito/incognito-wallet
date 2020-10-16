import { tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { useFocusEffect } from 'react-navigation-hooks';

export const useHistoryList = (props) => {
  const { handleLoadHistory } = props;
  const {
    histories,
    isFetched: isFetchedMergeHistory,
    isFetching: isFetchingMergeHistory,
    refreshing: refreshingHistory,
  } = useSelector(tokenSeleclor.historyTokenSelector);
  selectedPrivacySeleclor.selectedPrivacy;
  const receiveHistory = useSelector(tokenSeleclor.receiveHistorySelector);
  const {
    isFetching,
    isFetched,
    oversize,
    refreshing: refreshingReceiveHistory,
  } = receiveHistory;
  const refreshing = refreshingHistory || refreshingReceiveHistory;
  const showEmpty =
    histories?.length === 0 && isFetchedMergeHistory && !isFetchingMergeHistory;
  React.useEffect(() => {
    const notEnoughData =
      histories?.length < 10 &&
      !isFetching &&
      isFetched &&
      !oversize &&
      !refreshing;
    if (notEnoughData) {
      handleLoadHistory();
    }
  }, [histories, receiveHistory]);
  useFocusEffect(
    React.useCallback(() => {
      handleLoadHistory(true);
    }, []),
  );
  return [showEmpty, refreshing];
};

useHistoryList.propTypes = {
  handleLoadHistory: PropTypes.func.isRequired,
};
