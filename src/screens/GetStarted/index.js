import { setTokenHeader } from '@src/services/http';
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import { reloadWallet } from '@src/redux/actions/wallet';
import { followDefaultTokens } from '@src/redux/actions/account';
import { getPTokenList } from '@src/redux/actions/token';
import { accountSeleclor } from '@src/redux/selectors';
import routeNames from '@src/router/routeNames';
import { getToken } from '@src/services/api/user';
import { CustomError, ErrorCode, ExHandler } from '@src/services/exception';
import { getToken as getFirebaseToken } from '@src/services/firebase';
import { savePassword } from '@src/services/wallet/passwordService';
import serverService from '@src/services/wallet/Server';
import { initWallet } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import storageService from '@src/services/storage';
import DeviceInfo from 'react-native-device-info';
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

  goHome = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.Home);
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
    try {
      this.setState({ isInitialing: true });
      const { getPTokenList } = this.props;
      const token = await this.checkDeviceToken();

      if (token) {
        // console.log('Device token', token);
        setTokenHeader(token);
      }

      try {
        const pTokens = await getPTokenList();
        this.setState({ pTokens });
      } catch (e) {
        throw new CustomError(ErrorCode.getStarted_load_token_failed, { rawError: e });
      }

      if (!(await serverService.get())) {
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

  getExistedDeviceToken = async () => {
    try {
      const token = await storageService.getItem(CONSTANT_KEYS.DEVICE_TOKEN);
      return token;
    } catch (e) {
      throw throw new CustomError(ErrorCode.getStarted_load_device_token_failed, { rawError: e });
    }
  }

  registerToken = async () => {
    try {
      const fbToken = await getFirebaseToken();
      const uniqueId = DeviceInfo.getUniqueId();
      const token = await getToken(uniqueId, fbToken);

      return token;
    } catch (e) {
      throw e;
    }
  }

  checkDeviceToken = async () => {
    try {
      const token = await this.getExistedDeviceToken();
      if (!token) {
        const tokenData = await this.registerToken();
        storageService.setItem(CONSTANT_KEYS.DEVICE_TOKEN, tokenData?.token);
        return tokenData?.token;
      } else {
        return token;
      }
    } catch (e) {
      throw e;
    }
  }

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

const mapDispatch = { reloadWallet, getPTokenList, followDefaultTokens };

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
});

GetStartedContainer.propTypes = {
  reloadWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  getPTokenList: PropTypes.func.isRequired,
  account: PropTypes.object,
  followDefaultTokens: PropTypes.func.isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(GetStartedContainer);
