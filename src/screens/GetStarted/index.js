import { CONSTANT_CONFIGS } from '@src/constants';
import { reloadWallet } from '@src/redux/actions/wallet';
import routeNames from '@src/router/routeNames';
import { getToken } from '@src/services/api/user';
import { savePassword } from '@src/services/wallet/passwordService';
import serverService from '@src/services/wallet/Server';
import { initWallet } from '@src/services/wallet/WalletService';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import GetStarted from './GetStarted';

class GetStartedContainer extends Component {
  constructor() {
    super();

    this.state = {
      isInitialing: true
    };
  }

  componentDidMount() {
    this.initApp().then(this.checkExistedWallet);
  }

  goHome = () => {
    const { navigation } = this.props;
    navigation.navigate(routeNames.Home);
  };

  checkExistedWallet = async () => {
    try {
      const { reloadWallet } = this.props;
      const wallet = await reloadWallet(
        CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT
      );
      if (wallet) {
        this.goHome();
      }
    } catch (e) {
      throw new Error('Can not load existed wallet');
    }
  };

  initApp = async () => {
    try {
      this.setState({ isInitialing: true });
      if (!(await serverService.get())) {
        return serverService.setDefaultList();
      }
      return null;
    } catch {
      throw new Error('Error occurs while initialing wallet');
    } finally {
      this.setState({ isInitialing: false });
    }
  };

  handleCreateWallet = async () => {
    try {
      await savePassword(CONSTANT_CONFIGS.PASSPHRASE_WALLET_DEFAULT);
      return initWallet();
    } catch {
      throw new Error('Can not create new wallet');
    }
  };

  handleCreateNew = async () => {
    try {
      const { reloadWallet } = this.props;
      const token = await getToken();
      if (!token) throw new Error('Can not create user token');
      await this.handleCreateWallet();
      reloadWallet();
    } catch (e) {
      throw e;
    }
  };

  render() {
    const { isInitialing } = this.state;

    return (
      <GetStarted
        onCreateNew={this.handleCreateNew}
        goHome={this.goHome}
        isInitialing={isInitialing}
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
