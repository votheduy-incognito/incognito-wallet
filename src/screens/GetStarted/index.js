import http, { setTokenHeader } from '@src/services/http';
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import { reloadWallet, reloadAccountList } from '@src/redux/actions/wallet';
import { followDefaultTokens } from '@src/redux/actions/account';
import routeNames from '@src/router/routeNames';
import { getToken } from '@src/services/api/user';
import { savePassword } from '@src/services/wallet/passwordService';
import { getPTokenList } from '@src/redux/actions/token';
import serverService from '@src/services/wallet/Server';
import accountService from '@src/services/wallet/accountService';
import { initWallet } from '@src/services/wallet/WalletService';
import { accountSeleclor } from '@src/redux/selectors';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LocalDatabase from '@src/utils/LocalDatabase';
import { connect } from 'react-redux';
import storageService from '@src/services/storage';
import DeviceInfo from 'react-native-device-info';
import { getToken as getFirebaseToken } from '@src/services/firebase';
import { ErrorCode, CustomError, ExHandler } from '@src/services/exception';
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
      throw new CustomError(ErrorCode.wallet_can_not_load_existed_wallet);
    }
  }

  initApp = async () => {
    try {
      this.setState({ isInitialing: true });
      const token = await this.checkDeviceToken();

      if (token) {
        // console.log('Device token', token);
        setTokenHeader(token);
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
        await LocalDatabase.completeMigration();
      } else {
        const devices = await LocalDatabase.getListDevices();
        const isMigrated = await LocalDatabase.isMigrated();

        const isValidator = devices.length > 0;
        if (!isMigrated && !isValidator) {
          try {
            const isClearDatabase = await http.get('/game/clear');
            if (isClearDatabase) {
              const {reloadAccountList, reloadWallet} = this.props;
              await accountService.migrate(wallet);
              await LocalDatabase.completeMigration();
              await reloadWallet(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT);
              await reloadAccountList();
            }
          } catch (error) {
            //
          }
        }
      }

      this.setState({ isInitialing: false, isCreating: false });
      this.goHome();
    } catch (e) {
      this.setState({ isInitialing: false, isCreating: false });
      this.onError(
        new ExHandler(e, 'Something went wrong while opening wallet, please try again').showErrorToast().writeLog().message
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

      return initWallet();
    } catch {
      throw new CustomError(ErrorCode.wallet_can_not_create_new_wallet);
    }
  };

  getExistedDeviceToken = async () => {
    try {
      const token = await storageService.getItem(CONSTANT_KEYS.DEVICE_TOKEN);
      return token;
    } catch {
      throw throw new CustomError(ErrorCode.getStarted_load_device_token_failed);
    }
  }

  registerToken = async () => {
    try {
      const fbToken = await getFirebaseToken();
      const uniqueId = DeviceInfo.getUniqueID();
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
      const { account, getPTokenList, followDefaultTokens } = this.props;

      if (!account) throw new Error('Missing account');

      const pTokens = await getPTokenList();

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

const mapDispatch = { reloadWallet, getPTokenList, followDefaultTokens, reloadAccountList };

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state),
});

GetStartedContainer.propTypes = {
  reloadWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  getPTokenList: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
  followDefaultTokens: PropTypes.func.isRequired,
  reloadAccountList: PropTypes.func.isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(GetStartedContainer);
