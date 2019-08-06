import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectedPrivacySeleclor } from '@src/redux/selectors';
import convertUtil from '@src/utils/convert';
import CurrentBalance from './CurrentBalance';

const CurrentBalanceContainer = ({ selectedPrivacy, amount, symbol }) => {
  if (!selectedPrivacy) return null;

  return <CurrentBalance amount={amount ?? convertUtil.toHumanAmount(selectedPrivacy?.amount, selectedPrivacy?.decimals)} symbol={symbol ?? selectedPrivacy?.symbol} />;
};

const mapState = state => ({
  selectedPrivacy: selectedPrivacySeleclor.selectedPrivacy(state)
});

CurrentBalanceContainer.defaultProps = {
  selectedPrivacy: null,
  symbol: null,
  amount: null
};

CurrentBalanceContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  symbol: PropTypes.string,
  amount: PropTypes.oneOfType([ PropTypes.number, PropTypes.string])
};

export default connect(mapState)(CurrentBalanceContainer);