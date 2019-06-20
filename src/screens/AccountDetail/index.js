import { removeAccount } from '@src/redux/actions/account';
import PropTypes from 'prop-types';
import React from 'react';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AccountDetail from './AccountDetail';

const AccountDetailContainer = ({ account, ...otherProps }) => (
  <AccountDetail {...otherProps} account={account} />
);

const mapState = state => ({
  account: state.account.defaultAccount
});

const mapDispatch = { removeAccount };

AccountDetailContainer.propTypes = {
  account: PropTypes.objectOf(PropTypes.object)
};

export default compose(
  connect(
    mapState,
    mapDispatch
  ),
  withNavigation
)(AccountDetailContainer);
