import {
  LoadingContainer,
} from '@src/components/core';
import { StyleSheet } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import MainLayout from '@components/MainLayout';
import storage from '@src/services/storage';
import WelcomeNewUser from '@screens/GetStarted/WelcomeNewUser';
import WelcomeOldUser from '@screens/GetStarted/WelcomeOldUser';

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
});

const Welcome = () => {
  const [isExisted, setIsExisted] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(true);
  const navigation = useNavigation();

  const loadWallet = useCallback(async () => {
    const data = await storage.getItem('Wallet');

    setIsExisted(!!data);
    setLoadingWallet(false);
  }, []);

  const handleImport = () => {
    navigation.navigate(routeNames.InitImportMasterKey, { init: true });
  };

  const handleCreate = () => {
    navigation.navigate(routeNames.InitMasterKey , { init: true });
  };

  useEffect(() => {
    loadWallet();
  }, []);

  if (loadingWallet) {
    return <LoadingContainer />;
  }

  return (
    <MainLayout noHeader contentStyle={styles.flex}>
      {!isExisted ?
        <WelcomeNewUser onImport={handleImport} onCreate={handleCreate} /> :
        <WelcomeOldUser onImport={handleImport} onCreate={handleCreate} />
      }
    </MainLayout>
  );
};

export default Welcome;
