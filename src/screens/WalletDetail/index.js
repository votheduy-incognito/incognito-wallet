import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBalance } from '@src/redux/actions/account';
import LoadingContainer from '@src/components/LoadingContainer';
import accountService from '@src/services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import WalletDetail from './WalletDetail';


class WalletDetailContainer extends Component {
  onRemoveFollowToken = async tokenId => {
    try {
      const { account, wallet, setWallet } = this.props;
      const updatedWallet = await accountService.removeFollowingToken(tokenId, account, wallet);

      // update new wallet to store
      setWallet(updatedWallet);
      return true;
    } catch (e) {
      throw e;
    }
  };

  render() {
    const { wallet, account, selectedPrivacy, navigation, ...otherProps } = this.props;

    if (!selectedPrivacy) {
      return <LoadingContainer />;
    }

    return (
      <WalletDetail
        wallet={wallet}
        account={account}
        selectedPrivacy={selectedPrivacy}
        navigation={navigation}
        handleRemoveFollowToken={this.onRemoveFollowToken}
        {...otherProps}
      />
    );
  }
}

const mapState = state => ({
  account: state.account.defaultAccount,
  wallet: state.wallet,
  selectedPrivacy: state.selectedPrivacy
});

const mapDispatch = { getBalance, setWallet };

WalletDetailContainer.defaultProps = {
  selectedPrivacy: null
};

WalletDetailContainer.propTypes = {
  selectedPrivacy: PropTypes.object,
  defaultAccount: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  setWallet: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(WalletDetailContainer);