import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { setWallet } from '@src/redux/actions/wallet';
import Token from './Token';


const TokenContainer = ({ wallet, defaultAccount, ...otherProps}) => (
  <Token wallet={wallet} account={defaultAccount}  {...otherProps} />
);

const mapState = state => ({
  defaultAccount: state.account.defaultAccount,
  wallet: state.wallet,
});

const mapDispatch = { setWallet };

TokenContainer.propTypes = {
  defaultAccount: PropTypes.object,
  wallet: PropTypes.object,
};

export default compose(
  connect(mapState, mapDispatch),
  withNavigation
)(TokenContainer);