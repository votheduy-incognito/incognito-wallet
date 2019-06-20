import { getBalance } from '@src/redux/actions/account';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import SendConstant from './SendConstant';

const SendConstantContainer = ({ wallet, defaultAccount, ...otherProps }) => (
  <SendConstant wallet={wallet} account={defaultAccount} {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet
});

const mapDispatch = { getBalance };
SendConstantContainer.defaultProps = {
  defaultAccount: undefined,
  wallet: undefined
};
SendConstantContainer.propTypes = {
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  wallet: PropTypes.objectOf(PropTypes.object)
};

export default connect(
  mapState,
  mapDispatch
)(SendConstantContainer);
