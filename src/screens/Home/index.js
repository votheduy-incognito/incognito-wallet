import LoadingContainer from '@src/components/LoadingContainer';
import { getBalance as getAccountBalance, reloadAccountFollowingToken, /** loadAllPTokenHasBalance */ } from '@src/redux/actions/account';
import { clearSelectedPrivacy, setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import { getBalance, getInternalTokenList, getPTokenList, setListToken } from '@src/redux/actions/token';
import accountService from '@src/services/wallet/accountService';
import { setWallet } from '@src/redux/actions/wallet';
import { accountSeleclor, tokenSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import APIService from '@src/services/api/miner/APIService';
import { countFollowToken } from '@src/services/api/token';
import storageService from '@src/services/storage';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AppState } from 'react-native';
import { connect } from 'react-redux';
import { DEX } from '@src/utils/dex';
import { CONSTANT_KEYS } from '@src/constants';
import { DialogUpgradeToMainnet } from './ChildViews';
import Home from './Home';

class HomeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReloading: false,
      isReceivedPRV: false,
      appState: '',
    };
  }

  async componentDidMount() {
    const { navigation, clearSelectedPrivacy } = this.props;
    try {
      await this.reload();
      this.handleCountFollowedToken();
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }

    // airdrop program
    // this.airdrop();

    AppState.addEventListener('change', this.handleLogin);

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

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleLogin);
  }

  handleCountFollowedToken = async () => {
    try {
      const { tokens, account } = this.props;
      const isChecked = !!JSON.parse(await storageService.getItem(CONSTANT_KEYS.IS_CHECK_FOLLOWED_TOKEN));
      const tokenIds = tokens.map(t => t.id);
  
      if (!isChecked) {
        countFollowToken(tokenIds, account?.PublicKey).catch(null);
        storageService.setItem(CONSTANT_KEYS.IS_CHECK_FOLLOWED_TOKEN, JSON.stringify(true));
      }
    } catch (e) {
      new ExHandler(e);
    }
  }

  handleLogin = (nextAppState) => {
    const { appState } = this.state;
    if (appState.match(/background/) && nextAppState === 'active') {
      const { navigation, pin } = this.props;
      if (pin) {
        navigation.navigate(routeNames.AddPin, {action: 'login'});
      }
    }
    this.setState({ appState: nextAppState });
  };

  airdrop = async () => {
    try {
      const { account, getAccountByName } = this.props;
      const pDexAccount = getAccountByName(DEX.MAIN_ACCOUNT);
      const WalletAddress = account?.PaymentAddress;
      const pDexWalletAddress = pDexAccount?.PaymentAddress;

      const result = await APIService.airdrop1({ WalletAddress, pDexWalletAddress });

      if (result?.status === 1) {
        this.setState({
          isReceivedPRV: true
        });
      }
    } catch (e) {
      new ExHandler(e);
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
  };

  reload = async () => {
    try {
      this.setState({ isReloading: true });
      const { account, /* loadAllPTokenHasBalance */ } = this.props;
      const tasks = [
        this.getTokens(),
        this.getAccountBalance(account),
        this.getFollowingToken({ shouldLoadBalance: true })
      ];

      await Promise.all(tasks);
      // await loadAllPTokenHasBalance(account);
    } catch (e) {
      new ExHandler(e).showErrorToast();
    } finally {
      this.setState({ isReloading: false });
    }
  };

  onAddTokenToFollow = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.FollowToken, { isPrivacy: true });
  };

  onCreateToken = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.CreateToken, { isPrivacy: true });
  };

  onSetting = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.Setting, { isPrivacy: true });
  };

  getTokenBalance = async token => {
    try {
      const { getBalance } = this.props;
      await getBalance(token);
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, { rawError: e });
    }
  };

  removeOldTomo = async () => {
    try {
      const tomoTokenId = 'ba1e1865f97bc445a87e61fcec0880237b3c1747768b713d6e1706fde25a8c93';
      const { account, wallet, setWallet } = this.props;
      const updatedWallet = await accountService.removeFollowingToken(tomoTokenId, account, wallet);

      // update new wallet to store
      setWallet(updatedWallet);
    } catch (e) {
      new ExHandler(e);
    }
  }

  getAccountBalance = async account => {
    try {
      const { getAccountBalance } = this.props;
      return getAccountBalance(account);
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_balance_failed, { rawError: e });
    }
  };

  getFollowingToken = async ({ shouldLoadBalance = false } = {}) => {
    try {
      const { account, reloadAccountFollowingToken } = this.props;
      const result = await reloadAccountFollowingToken(account, { shouldLoadBalance });
      return result;
    } catch (e) {
      throw new CustomError(ErrorCode.home_load_following_token_failed, { rawError: e });
    }
  };

  handleSelectToken = (tokenId) => {
    if (!tokenId) return;

    const { setSelectedPrivacy, navigation } = this.props;

    setSelectedPrivacy(tokenId);

    navigation.navigate(routeNames.WalletDetail);
  };

  render() {
    const { isReloading, isReceivedPRV } = this.state;
    const { wallet, account, tokens } = this.props;

    if (!wallet) return <LoadingContainer />;

    return (
      <>
        <Home
          account={account}
          tokens={tokens}
          reload={this.reload}
          isReloading={isReloading}
          handleAddFollowToken={this.onAddTokenToFollow}
          handleCreateToken={this.onCreateToken}
          handleSetting={this.onSetting}
          onSelectToken={this.handleSelectToken}
        />
        <DialogUpgradeToMainnet
          isVisible={isReceivedPRV}
          onButtonClick={()=>{
            this.setState({isReceivedPRV: false});
          }}
        />
      </>
    );
  }
}

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  pin: state.pin.pin,
  wallet: state.wallet,
  tokens: tokenSeleclor.followed(state),
  getAccountByName: accountSeleclor.getAccountByName(state)
});

const mapDispatch = {
  setListToken,
  setWallet,
  getBalance,
  getAccountBalance,
  setSelectedPrivacy,
  clearSelectedPrivacy,
  reloadAccountFollowingToken,
  getPTokenList,
  getInternalTokenList,
  // loadAllPTokenHasBalance
};

HomeContainer.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  tokens: PropTypes.array.isRequired,
  wallet: PropTypes.object.isRequired,
  reloadAccountFollowingToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  getBalance: PropTypes.func.isRequired,
  setSelectedPrivacy: PropTypes.func.isRequired,
  clearSelectedPrivacy: PropTypes.func.isRequired,
  getPTokenList: PropTypes.func.isRequired,
  getInternalTokenList: PropTypes.func.isRequired,
  setWallet: PropTypes.func.isRequired,
  getAccountByName: PropTypes.func.isRequired,
  pin: PropTypes.string.isRequired,
  // loadAllPTokenHasBalance: PropTypes.func.isRequired,
};


export default connect(
  mapState,
  mapDispatch
)(HomeContainer);
