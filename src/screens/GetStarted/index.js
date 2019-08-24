import { setTokenHeader } from '@src/services/http';
import { CONSTANT_CONFIGS, CONSTANT_KEYS } from '@src/constants';
import { reloadWallet } from '@src/redux/actions/wallet';
import routeNames from '@src/router/routeNames';
import { getToken } from '@src/services/api/user';
import { savePassword } from '@src/services/wallet/passwordService';
import serverService from '@src/services/wallet/Server';
import { initWallet } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { createError, messageCode } from '@src/services/errorHandler';
import { connect } from 'react-redux';
import storageService from '@src/services/storage';
import DeviceInfo from 'react-native-device-info';
import { getToken as getFirebaseToken } from '@src/services/firebase';
import GetStarted from './GetStarted';


class GetStartedContainer extends Component {
  constructor() {
    super();

    this.state = {
      isInitialing: true,
      errorMsg: null
    };
  }

  componentDidMount() {
    this.initApp();
  }

  onError = msg => this.setState({ errorMsg: msg })

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
      this.onError('Can not load existed wallet.');
    }
  }

  initApp = async () => {
    try {
      this.setState({ isInitialing: true });
      const token = await this.checkDeviceToken();

      if (token) {
        console.log('Device token', token);
        setTokenHeader(token);
      }

      if (!(await serverService.get())) {
        await serverService.setDefaultList();
      }
      const wallet = await this.getExistedWallet();

      // loaded wallet & then continue to Home screen
      if (!wallet) {
        // create new Wallet
        await this.handleCreateNew();
      }

      this.setState({ isInitialing: false });
      this.goHome();
    } catch (e) {
      this.setState({ isInitialing: false });
      this.onError('Something went wrong while opening wallet, please try again');
    }
  };

  handleCreateWallet = async () => {
    try {
      await savePassword(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT);

      // just make sure there has no existed wallet
      const wallet = await this.getExistedWallet();

      if (wallet) {
        return throw createError({ code: messageCode.code.can_not_create_wallet_on_existed });
      }
      
      return initWallet();
    } catch (e) {
      throw e;
    }
  };

  getExistedDeviceToken = async () => {
    try {
      const token = await storageService.getItem(CONSTANT_KEYS.DEVICE_TOKEN);
      return token;
    } catch (e) {
      throw createError({ code: messageCode.code.load_device_token_failed });
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
      const fbToken = await getFirebaseToken();
      console.log('fbToken', fbToken);
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

  handleCreateNew = async () => {
    try {
      const { reloadWallet } = this.props;
      await this.handleCreateWallet();
      const wallet = await reloadWallet();
      
      if (wallet) {
        this.goHome();
      } else {
        throw new Error('Load new wallet failed');
      }
    } catch (e) {
      this.onError('Can not create new wallet, please try again');
    }
  };

  handleRytry = () => {
    this.initApp();
    this.setState({ errorMsg: null, isInitialing: true });
  }

  render() {
    const { isInitialing, errorMsg } = this.state;
    return (
      <GetStarted
        errorMsg={errorMsg}
        isInitialing={isInitialing}
        onRetry={this.handleRytry}
      />
    );
  }
}

const mapDispatch = { reloadWallet };

GetStartedContainer.propTypes = {
  reloadWallet: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
};

export default connect(
  null,
  mapDispatch
)(GetStartedContainer);
