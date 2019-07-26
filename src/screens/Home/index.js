import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance as getAccountBalance, reloadAccountFollowingToken } from '@src/redux/actions/account';
import { setListToken, getBalance } from '@src/redux/actions/token';
import { setSelectedPrivacy, clearSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import scheduleService from '@src/services/schedule';
import routeNames from '@src/router/routeNames';
import tokenData from '@src/constants/tokenData';
import { connect } from 'react-redux';
import { accountSeleclor, tokenSeleclor, sharedSeleclor } from '@src/redux/selectors';
import Home from './Home';

class HomeContainer extends Component {
  constructor() {
    super();
    this.state = { isReloading: false };
  }

  componentDidMount() {
    const { account, navigation, clearSelectedPrivacy, getAccountBalance, accountList } = this.props;

    this.getFollowingToken();
    this.getAccountBalance(account);

    scheduleService.reloadAllAccountBalance({
      accounts: accountList,
      getBalance: getAccountBalance,
    });


    navigation.addListener(
      'didFocus',
      () => {
        clearSelectedPrivacy();
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
      this.setState({ isReloading: true });
      const { getAccountBalance, account } = this.props;
      await getAccountBalance(account);
      this.getFollowingToken();
    } catch {
      Toast.showError('Reload data failed');
    } finally {
      this.setState({ isReloading: false });
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
      const { account, reloadAccountFollowingToken } = this.props;
      return reloadAccountFollowingToken(account);
    } catch {
      Toast.showError('Can not get list token for this account');
    }
  }

  handleSelectToken = (token) => {
    if (!token) return;

    const { setSelectedPrivacy, navigation } = this.props;

    setSelectedPrivacy(token?.symbol);

    navigation.navigate(routeNames.WalletDetail);
  }

  render() {
    const { isReloading } = this.state;
    const { wallet, account, tokens, isGettingBalanceList } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <Home
        account={account}
        tokens={tokens}
        reload={this.reload}
        isReloading={isReloading}
        handleAddFollowToken={this.onAddTokenToFollow}
        isGettingBalanceList={isGettingBalanceList}
        onSelectToken={this.handleSelectToken}
      />
    );
  }
}

const mapState = state => ({
  accountList: accountSeleclor.listAccount(state),
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  isGettingBalanceList: sharedSeleclor.isGettingBalance(state)
});

const mapDispatch = { setListToken, getBalance, getAccountBalance, setSelectedPrivacy, clearSelectedPrivacy, reloadAccountFollowingToken };

HomeContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  accountList: PropTypes.array.isRequired,
  tokens: PropTypes.array.isRequired,
  isGettingBalanceList: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  reloadAccountFollowingToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  setSelectedPrivacy: PropTypes.func.isRequired,
  clearSelectedPrivacy: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
