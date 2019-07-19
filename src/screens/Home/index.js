import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance as getAccountBalance } from '@src/redux/actions/account';
import { setListToken, getBalance } from '@src/redux/actions/token';
import { setSelectedPrivacy, clearSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import scheduleService from '@src/services/schedule';
import accountService from '@src/services/wallet/accountService';
import SelectedPrivacyModel from '@src/models/selectedPrivacy';
import routeNames from '@src/router/routeNames';
import tokenData from '@src/constants/tokenData';
import { connect } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import Home from './Home';

class HomeContainer extends Component {
  componentDidMount() {
    const { account, navigation, clearSelectedPrivacy, getAccountBalance, accountList } = this.props;

    this.getFollowingToken();
    this.getAccountBalance(account);

    scheduleService.reloadAllAccountBalance({
      accounts: accountList,
      getBalance: getAccountBalance
    });


    navigation.addListener(
      'didFocus',
      () => {
        clearSelectedPrivacy();
        this.reload();
      }
    );
  }

  componentDidUpdate(prevProps) {
    const { wallet } = this.props;

    // reload tokens list if wallet was changed
    if (prevProps.wallet !== wallet) {
      this.getFollowingToken();
    }
  }

  reload = async () => {
    try {
      const { getAccountBalance, account } = this.props;
      await getAccountBalance(account);
      this.getFollowingToken();
    } catch {
      Toast.showError('Reload data failed');
    }
  }

  onAddTokenToFollow = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.FollowToken, { isPrivacy: true });
  }

  getTokenBalance = async token => {
    try {
      const { getBalance } = this.props;
      await getBalance(token);
    } catch {
      Toast.showError(`Get ${token?.symbol} balance failed`);
    }
  }

  getAccountBalance = async account => {
    try {
      const { getAccountBalance } = this.props;
      return getAccountBalance(account);
    } catch {
      Toast.showError(`Load ${tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY} balance failed`);
    }
  }

  getFollowingToken = async () => {
    try {
      const { account, wallet, setListToken } = this.props;
      const tokens = accountService.getFollowingTokens(account, wallet);

      tokens.forEach(this.getTokenBalance);
      setListToken(tokens);
    } catch {
      Toast.showError('Can not get list token for this account');
    }
  }

  handleSelectToken = (token) => {
    if (!token) return;

    const { account, tokens, setSelectedPrivacy, navigation } = this.props;
    const tokenData = tokens.find(t => t.symbol === token.symbol);

    const privacyToken = SelectedPrivacyModel.parse(account, tokenData);
    setSelectedPrivacy(privacyToken);

    navigation.navigate(routeNames.WalletDetail);
  }

  render() {
    const { wallet, account, tokens, isGettingBalanceList } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <Home
        account={account}
        tokens={tokens}
        handleAddFollowToken={this.onAddTokenToFollow}
        isGettingBalanceList={isGettingBalanceList}
        onSelectToken={this.handleSelectToken}
      />
    );
  }
}

const mapState = state => ({
  accountList: state.account.list,
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: state.token.followed || [],
  isGettingBalanceList: [...state.account.isGettingBalance, ...state.token.isGettingBalance]
});

const mapDispatch = { setListToken, getBalance, getAccountBalance, setSelectedPrivacy, clearSelectedPrivacy };

HomeContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  accountList: PropTypes.array.isRequired,
  tokens: PropTypes.array.isRequired,
  isGettingBalanceList: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  setListToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  setSelectedPrivacy: PropTypes.func.isRequired,
  clearSelectedPrivacy: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
