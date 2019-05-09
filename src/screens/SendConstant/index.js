import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SendConstant from './SendConstant';

const SendConstantContainer = ({ wallet, defaultAccount, ...otherProps}) => (
  <SendConstant wallet={wallet} account={defaultAccount}  {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet,
});

SendConstantContainer.propTypes = {
  defaultAccount: PropTypes.object,
  wallet: PropTypes.object,
};

export default connect(mapState)(SendConstantContainer);