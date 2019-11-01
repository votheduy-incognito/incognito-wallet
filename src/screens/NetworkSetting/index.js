import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { reloadWallet } from '@src/redux/actions/wallet';
import { getBalance as getAccountBalance } from '@src/redux/actions/account';
import { accountSeleclor } from '@src/redux/selectors';
import serverService from '@src/services/wallet/Server';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Util from '@src/utils/Util';
import ROUTE_NAMES from '@src/router/routeNames';
import storageService from '@src/services/storage';
import { CONSTANT_KEYS } from '@src/constants';
import RNRestart from 'react-native-restart';
import NetworkSetting from './NetworkSetting';

const NetworkSettingContainer = ({
  reloadWallet,
  navigation,
  getAccountBalance,
  account,
  ...props
}) => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadServerList = () => {
    setIsLoading(true);
    serverService
      .get()
      .then(servers => {
        setServers(servers);

        const onReloadedNetworks = navigation.getParam('onReloadedNetworks');
        if (typeof onReloadedNetworks === 'function') {
          onReloadedNetworks();
        }

      })
      .catch(() => {
        Toast.showError('Something went wrong. Please refresh the screen.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSetDefaultNetwork = async network => {
    try {
      await serverService.setDefault(network);
      await storageService.removeItem(CONSTANT_KEYS.DEVICE_TOKEN);
      // Util.resetRoute(navigation,ROUTE_NAMES.RootSplash);
      const wallet = await reloadWallet();
      await getAccountBalance(account);

      if (wallet) {
        Toast.showInfo('You successfully changed networks.');
      }
      RNRestart.Restart();
    } catch {
      Toast.showError(
        'Something went wrong. Please try again.'
      );
    }
  };

  useEffect(() => {
    loadServerList();
  }, []);

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <NetworkSetting
      {...props}
      networks={servers}
      reloadNetworks={loadServerList}
      setDefaultNetwork={handleSetDefaultNetwork}
    />
  );
};

const mapDispatch = { reloadWallet, getAccountBalance };

const mapState = state => ({
  account: accountSeleclor.defaultAccount(state)
});

NetworkSettingContainer.propTypes = {
  reloadWallet: PropTypes.func.isRequired,
  setDefaultServer: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  account: PropTypes.object.isRequired,
};

export default connect(
  mapState,
  mapDispatch
)(NetworkSettingContainer);
