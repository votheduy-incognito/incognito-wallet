import React, { useState, useEffect } from 'react';
import serverService from '@src/services/wallet/Server';
import LoadingContainer from '@src/components/LoadingContainer';
import NetworkSetting from './NetworkSetting';
import { Toast } from '@src/components/core';

const NetworkSettingContainer = (props) => {
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

  useEffect(() => {
    loadServerList();
  }, []);

  if (isLoading) {
    return <LoadingContainer />;
  }

  return <NetworkSetting {...props} networks={servers} setDefaultNetwork={serverService.setDefault} />;
};


export default NetworkSettingContainer;