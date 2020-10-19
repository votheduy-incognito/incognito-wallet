import React from 'react';
import PropTypes from 'prop-types';
import HistoryList from '@src/components/HistoryList';
import { useSelector } from 'react-redux';
import { tokenSeleclor } from '@src/redux/selectors';
import withHistoryToken from './HistoryToken.enhance';
import EmptyHistory from './HistoryToken.empty';

const HistoryToken = (props) => {
  const { histories } = useSelector(tokenSeleclor.historyTokenSelector);
  const { isFetching, oversize } = useSelector(
    tokenSeleclor.receiveHistorySelector,
  );
  const {
    handleCancelEtaHistory,
    handleLoadHistory,
    showEmpty,
    refreshing,
  } = props;
  return (
    <HistoryList
      histories={histories}
      onCancelEtaHistory={handleCancelEtaHistory}
      onRefreshHistoryList={() => handleLoadHistory(true, false)}
      onLoadmoreHistory={() => handleLoadHistory(false, true)}
      refreshing={refreshing}
      loading={isFetching}
      renderEmpty={() => <EmptyHistory />}
      showEmpty={showEmpty}
      oversize={oversize}
    />
  );
};

HistoryToken.propTypes = {
  handleCancelEtaHistory: PropTypes.func.isRequired,
  handleLoadHistory: PropTypes.func.isRequired,
  showEmpty: PropTypes.bool.isRequired,
  refreshing: PropTypes.bool.isRequired,
};

export default withHistoryToken(HistoryToken);
