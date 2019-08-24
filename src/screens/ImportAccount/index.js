import { Toast } from '@src/components/core';
import { reloadAccountList } from '@src/redux/actions/wallet';
import accountService from '@src/services/wallet/accountService';
import { getPassphrase } from '@src/services/wallet/passwordService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ImportAccount from './ImportAccount';

class ImportAccountContainer extends Component {
  importAccount = async ({ accountName, privateKey }) => {
    try {
      const { wallet, reloadAccountList } = this.props;
      const passphrase = await getPassphrase();

      const isImported = await accountService.importAccount(
        privateKey,
        accountName,
        passphrase,
        wallet
      );
      if (!isImported) throw new Error('Account was not imported!');

      Toast.showInfo(`Your account ${accountName} was import!`);

      await reloadAccountList();
      return true;
    } catch(e) {

      Toast.showError('Import account failed');
      throw e;
    }
  };

  render() {
    return <ImportAccount {...this.props} importAccount={this.importAccount} />;
  }
}

const mapState = state => ({
  wallet: state.wallet,
  accountList: state.account.list || []
});

const mapDispatch = { reloadAccountList };

ImportAccountContainer.propTypes = {
  wallet: PropTypes.object.isRequired,
  reloadAccountList: PropTypes.func.isRequired,
};

export default connect(
  mapState,
  mapDispatch,
  null,
  {
    forwardRef: true
  }
)(ImportAccountContainer);
