import { Toast } from '@src/components/core';
import { reloadAccountList } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import { followDefaultTokens } from '@src/redux/actions/account';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AccountModel from '@src/models/account';
import CreateAccount from './CreateAccount';

class CreateAccountContainer extends Component {
  createAccount = async (
    accountName = new Error('Account name is required')
  ) => {
    try {
      const { wallet, reloadAccountList, followDefaultTokens } = this.props;

      const account = await accountService.createAccount(accountName, wallet);
      Toast.showInfo('Success! Account created.');
      
      await reloadAccountList();

      const serializedAccount = new AccountModel(accountService.toSerializedAccountObj(account));
      console.log('CreateAccount function ---- result =', serializedAccount);

      // follow default tokens
      followDefaultTokens(serializedAccount);

      return serializedAccount;
    } catch {
      Toast.showError('Something went wrong. Please try again.');
    }
    return null;
  };

  render() {
    return <CreateAccount {...this.props} createAccount={this.createAccount} />;
  }
}

const mapState = state => ({
  wallet: state.wallet,
  accountList: state.account.list || []
});

const mapDispatch = { reloadAccountList, followDefaultTokens };

CreateAccountContainer.propTypes = {
  wallet: PropTypes.objectOf(PropTypes.object),
  reloadAccountList: PropTypes.func.isRequired,
  followDefaultTokens: PropTypes.func.isRequired,
};

export default connect(
  mapState,
  mapDispatch,
  null,
  {
    forwardRef: true
  }
)(CreateAccountContainer);
