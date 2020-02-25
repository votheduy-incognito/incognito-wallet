import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import formatUtil from '@src/utils/format';
import CurrentBalance from './CurrentBalance';

const CurrentBalanceContainer = ({ selectedPrivacy, symbol, select }) => {
  if (!selectedPrivacy) return null;

  return <CurrentBalance
    amount={formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy?.pDecimals)}
    symbol={symbol ?? selectedPrivacy?.symbol}
    select={select}
  />;
};

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state)
});

CurrentBalanceContainer.defaultProps = {
  selectedPrivacy: null,
  symbol: null,
};

CurrentBalanceContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  symbol: PropTypes.string,
};

export default connect(mapState)(CurrentBalanceContainer);
