import { setDefaultAccount, reloadAccountFollowingToken } from '@src/redux/actions/account';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteWallet } from '@src/services/wallet/WalletService';
import routeNames from '@src/router/routeNames';
import { accountSeleclor } from '@src/redux/selectors';
import UserHeaderBoard from './UserHeaderBoard';

class UserHeaderBoardContainer extends Component {
  onHandleSwitchAccount = account => {
    const { setDefaultAccount, reloadAccountFollowingToken } = this.props;

    setDefaultAccount(account);
    reloadAccountFollowingToken(account);
  };

  onDeleteWallet = () => {
    try {
      const { wallet, navigation } = this.props;
      deleteWallet(wallet);

      navigation.navigate(routeNames.RootSplash);
    } catch {
      throw new Error('Can not delete wallet, please try again.');
    }
  }

  render() {
    return (
      <UserHeaderBoard
        {...this.props}
        handleSwitchAccount={this.onHandleSwitchAccount}
        handleDeleteWallet={this.onDeleteWallet}
      />
    );
  }
}

const mapState = state => ({
  wallet: state.wallet,
  defaultAccountName: accountSeleclor.defaultAccount(state)?.name,
  accountList: state.account?.list,
  isGettingBalance: state.account?.isGettingBalance
});

const mapDispatch = { setDefaultAccount, reloadAccountFollowingToken };
UserHeaderBoardContainer.defaultProps = {
  setDefaultAccount: undefined
};
UserHeaderBoardContainer.propTypes = {
  setDefaultAccount: PropTypes.func,
  reloadAccountFollowingToken: PropTypes.func.isRequired,
  wallet: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired
};

export default connect(
  mapState,
  mapDispatch
)(UserHeaderBoardContainer);
