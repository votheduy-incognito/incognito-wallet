import { login } from '@src/services/auth';
import { CONSTANT_KEYS, CONSTANT_CONFIGS } from '@src/constants';
import { reloadWallet, reloadAccountList } from '@src/redux/actions/wallet';
import { followDefaultTokens } from '@src/redux/actions/account';
import { getPTokenList } from '@src/redux/actions/token';
import { loadPin } from '@src/redux/actions/pin';
import { accountSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import storageService from '@src/services/storage';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { savePassword } from '@src/services/wallet/passwordService';
import serverService from '@src/services/wallet/Server';
import { initWallet } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DEX } from '@src/utils/dex';
import accountService from '@src/services/wallet/accountService';
import GetStarted from './GetStarted';

class GetStartedContainer extends Component {
  constructor() {
    super();

    this.state = {
      isInitialing: true,
      isCreating: false,
      errorMsg: null
    };
  }

  componentDidMount() {
    this.initApp();
  }

  onError = msg => this.setState({ errorMsg: msg });

  goHome = async () => {
    const { navigation, pin } = this.props;

    const wallet = await this.getExistedWallet();

    let accounts = await wallet.listAccount();

    if(!accounts.find(item => item.AccountName === DEX.MAIN_ACCOUNT)) {
      const firstAccount = accounts[0];
      await accountService.createAccount(DEX.MAIN_ACCOUNT, wallet, accountService.parseShard(firstAccount));
    }

    if(!accounts.find(item => item.AccountName === DEX.WITHDRAW_ACCOUNT)) {
      accounts = await wallet.listAccount();
      const dexMainAccount = accounts.find(item => item.AccountName === DEX.MAIN_ACCOUNT);
      await accountService.createAccount(DEX.WITHDRAW_ACCOUNT, wallet, accountService.parseShard(dexMainAccount));
    }

    const { reloadAccountList } = this.props;
    reloadAccountList();

    if (pin) {
      navigation.navigate(routeNames.AddPin, { action: 'login', redirectRoute: routeNames.Home });
    } else {
      navigation.navigate(routeNames.Home,{isNeedUpgrade: this.isNeedUpgrade});
    }
  };

  getExistedWallet = async () => {
    try {
      const { reloadWallet } = this.props;
      const wallet = await reloadWallet(
        CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT
      );
      if (wallet) {
        return wallet;
      }
      return null;
    } catch (e) {
      throw new CustomError(ErrorCode.wallet_can_not_load_existed_wallet, { rawError: e });
    }
  }

  initApp = async () => {
    const { loadPin } = this.props;
    try {
      await loadPin();
      this.setState({ isInitialing: true });
      console.log('initApp CONSTANT_CONFIGS = ',CONSTANT_CONFIGS);
      const serverLocalList = await serverService.get()??[];
      // this.isNeedUpgrade = !_.isEmpty(serverLocalList) && CONSTANT_CONFIGS.DEFAULT_LIST_SERVER.length != serverLocalList.length;
      this.isNeedUpgrade = CONSTANT_CONFIGS.DEFAULT_LIST_SERVER.length != serverLocalList?.length;
      if (this.isNeedUpgrade) {
        await storageService.clear();
        await storageService.setItem(CONSTANT_KEYS.DISPLAYED_WIZARD, String(true));
      }
      const { getPTokenList } = this.props;
      await login();

      try {
        const pTokens = await getPTokenList();
        this.setState({ pTokens });
      } catch (e) {
        throw new CustomError(ErrorCode.getStarted_load_token_failed, { rawError: e });
      }

      if (this.isNeedUpgrade || !(serverLocalList)) {
        await serverService.setDefaultList();
      }
      const wallet = await this.getExistedWallet();

      // loaded wallet & then continue to Home screen
      if (!wallet) {
        this.setState({ isCreating: true });
        // create new Wallet
        await this.handleCreateNew();
      }

      this.setState({ isInitialing: false, isCreating: false });
      this.goHome();
    } catch (e) {
      this.setState({ isInitialing: false, isCreating: false });
      this.onError(
        new ExHandler(e, 'Sorry, something went wrong while opening the wallet. Please check your connection or re-install the application and try again.').writeLog().message
      );
    }
  };

  handleCreateWallet = async () => {
    try {
      await savePassword(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT);

      // just make sure there has no existed wallet
      const wallet = await this.getExistedWallet();

      if (wallet) {
        return throw new CustomError(ErrorCode.getStarted_can_not_create_wallet_on_existed);
      }

      requestAnimationFrame(() => {
        return initWallet();
      });
    } catch (e) {
      throw new CustomError(ErrorCode.wallet_can_not_create_new_wallet, { rawError: e });
    }
  };

  setDefaultPToken = async () => {
    try {
      const { account, followDefaultTokens } = this.props;
      const { pTokens } = this.state;

      if (!account) throw new Error('Missing account');

      await followDefaultTokens(account, pTokens);
    } catch {
      // can ignore this err
    }
  }

  handleCreateNew = async () => {
    try {
      const { reloadWallet } = this.props;
      await this.handleCreateWallet();
      const wallet = await reloadWallet();

      if (wallet) {
        await this.setDefaultPToken(wallet);
        this.goHome();
      } else {
        throw new Error('Load new wallet failed');
      }
    } catch (e) {
      throw e;
    }
  };

  handleRytry = () => {
    this.initApp();
    this.setState({ errorMsg: null, isInitialing: true });
  }

  render() {
    const { isInitialing, errorMsg, isCreating } = this.state;
    return (
      <GetStarted
        errorMsg={errorMsg}
        isInitialing={isInitialing}
        isCreating={isCreating}
        onRetry={this.handleRytry}
      />
    );
  }
}

const mapDispatch = { reloadWallet, getPTokenList, followDefaultTokens, reloadAccountList, loadPin };

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
  pin: state.pin.pin,
});

GetStartedContainer.propTypes = {
  reloadWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  getPTokenList: PropTypes.func.isRequired,
  account: PropTypes.object,
  reloadAccountList: PropTypes.func.isRequired,
  followDefaultTokens: PropTypes.func.isRequired,
};

GetStartedContainer.defaultProps = {
  account: null
};

export default connect(
  mapState,
  mapDispatch
)(GetStartedContainer);
