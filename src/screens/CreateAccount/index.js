import { Toast } from '@src/components/core';
import { reloadAccountList } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreateAccount from './CreateAccount';

class CreateAccountContainer extends Component {
  createAccount = async (
    accountName = new Error('Account name is required')
  ) => {
    try {
      const { wallet, reloadAccountList } = this.props;

      await accountService.createAccount(accountName, wallet);
      Toast.showInfo(`Your account ${accountName} was created!`);

      await reloadAccountList();
    } catch {
      Toast.showError('Create account failed');
    }
  };

  render() {
    return <CreateAccount {...this.props} createAccount={this.createAccount} />;
  }
}

const mapState = state => ({
  wallet: state.wallet,
  accountList: state.account.list || []
});

const mapDispatch = { reloadAccountList };

CreateAccountContainer.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
  reloadAccountList: PropTypes.func
};

export default connect(
  mapState,
  mapDispatch
)(CreateAccountContainer);
