import { setWallet } from '@src/redux/actions/wallet';
import PropTypes from 'prop-types';
import React from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { accountSeleclor } from '@src/redux/selectors';
import Token from './Token';

const TokenContainer = ({ wallet, defaultAccount, ...otherProps }) => (
  <Token wallet={wallet} account={defaultAccount} {...otherProps} />
);

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
  wallet: state.wallet
});

const mapDispatch = { setWallet };
TokenContainer.defaultProps = {
  defaultAccount: undefined,
  wallet: undefined
};
TokenContainer.propTypes = {
  defaultAccount: PropTypes.objectOf(PropTypes.object),
  wallet: PropTypes.objectOf(PropTypes.object)
};

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  withNavigation
)(TokenContainer);
