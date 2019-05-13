import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';
import { compose } from 'redux';
import { connect } from 'react-redux';
import AccountDetail from './AccountDetail';

const AccountDetailContainer = ({ account, ...otherProps}) => <AccountDetail {...otherProps} account={account}  />;

const mapState = state => ({
  account: state.account.defaultAccount
});

AccountDetailContainer.propTypes = {
  account: PropTypes.object
};

export default compose(
  connect(mapState),
  withNavigation
)(AccountDetailContainer);