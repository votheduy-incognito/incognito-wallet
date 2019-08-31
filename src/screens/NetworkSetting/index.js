import { Toast } from '@src/components/core';
import LoadingContainer from '@src/components/LoadingContainer';
import { setDefaultServer } from '@src/redux/actions/server';
import { reloadWallet } from '@src/redux/actions/wallet';
import serverService from '@src/services/wallet/Server';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import NetworkSetting from './NetworkSetting';

const NetworkSettingContainer = ({
  reloadWallet,
  setDefaultServer,
  ...props
}) => {
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadServerList = () => {
    setIsLoading(true);
    serverService
      .get()
      .then(setServers)
      .catch(() => {
        Toast.showError('Something went wrong. Please refresh the screen.');
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
        Toast.showInfo('You successfully changed networks.');
      }
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
      setDefaultNetwork={handleSetDefaultNetwork}
    />
  );
};

const mapDispatch = { reloadWallet, setDefaultServer };
NetworkSettingContainer.defaultProps = {
  reloadWallet: undefined
};

NetworkSettingContainer.propTypes = {
  reloadWallet: PropTypes.func
};

export default connect(
  null,
  mapDispatch
)(NetworkSettingContainer);
