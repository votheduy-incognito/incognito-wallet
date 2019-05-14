import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import serverService from '@src/services/wallet/Server';
import LoadingContainer from '@src/components/LoadingContainer';
import { reloadWallet } from '@src/redux/actions/wallet';
import { setDefaultServer } from '@src/redux/actions/server';
import NetworkSetting from './NetworkSetting';
import { Toast } from '@src/components/core';

const NetworkSettingContainer = ({ reloadWallet, setDefaultServer, ...props }) => {
  const [ servers, setServers ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  const loadServerList = () => {
    setIsLoading(true);
    serverService.get().then(setServers)
      .catch(() => {
        Toast.showError('Error while getting server list');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSetDefaultNetwork = async network => {
    try {
      setDefaultServer(network);
      await serverService.setDefault(network);
      const wallet = await reloadWallet();

      if (wallet) {
        Toast.showInfo('Update completed, your wallet was reloaded');
      }
    } catch {
      Toast.showError('Error while changing new server setting, please restart the app');
    }
  };

  useEffect(() => {
    loadServerList();
  }, []);

  if (isLoading) {
    return <LoadingContainer />;
  }

  return <NetworkSetting {...props} networks={servers} setDefaultNetwork={handleSetDefaultNetwork} />;
};

const mapDispatch = { reloadWallet, setDefaultServer };

NetworkSettingContainer.propTypes = {
  reloadWallet: PropTypes.func
};

export default connect(null, mapDispatch)(NetworkSettingContainer);