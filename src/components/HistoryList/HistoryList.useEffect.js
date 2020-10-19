import { tokenSeleclor, selectedPrivacySeleclor } from '@src/redux/selectors';
import { useSelector } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { useFocusEffect } from 'react-navigation-hooks';

export const useHistoryList = (props) => {
  const { handleLoadHistory } = props;
  selectedPrivacySeleclor.selectedPrivacy;
  const receiveHistory = useSelector(tokenSeleclor.receiveHistorySelector);
  const { notEnoughData, showEmpty, refreshing } = receiveHistory;
  const { histories } = useSelector(tokenSeleclor.historyTokenSelector);
  React.useEffect(() => {
    if (notEnoughData) {
      handleLoadHistory(false, true);
    }
  }, [histories, receiveHistory]);
  useFocusEffect(
    React.useCallback(() => {
      handleLoadHistory(true, false);
    }, []),
  );
  return [showEmpty, refreshing];
};

useHistoryList.propTypes = {
  handleLoadHistory: PropTypes.func.isRequired,
};
