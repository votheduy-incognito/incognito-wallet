import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance as getAccountBalance, reloadAccountFollowingToken } from '@src/redux/actions/account';
import { clearSelectedPrivacy, setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import { getBalance, getInternalTokenList, getPTokenList, setListToken } from '@src/redux/actions/token';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './Home';

class HomeContainer extends Component {
  constructor() {
    super();
    this.state = { isReloading: false };
  }

  async componentDidMount() {
    const { account, navigation, clearSelectedPrivacy } = this.props;
    try {
      this.getTokens();
      this.getFollowingToken();
      this.getAccountBalance(account);

      await Promise.all([
        this.getTokens(),
        this.getFollowingToken(),
        this.getAccountBalance(account),
      ]);
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }

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

  getTokens = async () => {
    try {
      const { getPTokenList, getInternalTokenList } = this.props;
      await getPTokenList();
      await getInternalTokenList();
    } catch (e) {
      new ExHandler(e, 'Sorry, we can not get list of tokens, reopen the app can fix it.');
    }
  }

  reload = async () => {
    try {
      this.setState({ isReloading: true });
      const { account } = this.props;
      const tasks = [
        this.getAccountBalance(account),
        this.getFollowingToken()
      ];

      await Promise.all(tasks);
    } catch (e) {
      new ExHandler(e).showErrorToast();
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
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, { rawError: e });
    }
  }

  getAccountBalance = async account => {
    try {
      const { getAccountBalance } = this.props;
      return getAccountBalance(account);
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, { rawError: e });
    }
  }

  getFollowingToken = async () => {
    try {
      const { account, reloadAccountFollowingToken } = this.props;
      const result = await reloadAccountFollowingToken(account);
      return result;
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_following_token_failed, { rawError: e });
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
    const { wallet, account, tokens, accountGettingBalanceList, tokenGettingBalanceList } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <Home
        account={account}
        tokens={tokens}
        reload={this.reload}
        isReloading={isReloading}
        handleAddFollowToken={this.onAddTokenToFollow}
        accountGettingBalanceList={accountGettingBalanceList}
        tokenGettingBalanceList={tokenGettingBalanceList}
        onSelectToken={this.handleSelectToken}
      />
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  accountGettingBalanceList: accountSeleclor.isGettingBalance(state),
  tokenGettingBalanceList: tokenSeleclor.isGettingBalance(state)
});

const mapDispatch = { setListToken, getBalance, getAccountBalance, setSelectedPrivacy, clearSelectedPrivacy, reloadAccountFollowingToken, getPTokenList, getInternalTokenList };

HomeContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  tokens: PropTypes.array.isRequired,
  tokenGettingBalanceList: PropTypes.array.isRequired,
  accountGettingBalanceList: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  reloadAccountFollowingToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  setSelectedPrivacy: PropTypes.func.isRequired,
  clearSelectedPrivacy: PropTypes.func.isRequired,
  getPTokenList: PropTypes.func.isRequired,
  getInternalTokenList: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
