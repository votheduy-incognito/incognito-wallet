import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, Toast, ActivityIndicator } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import { getPassphrase } from '@src/services/wallet/passwordService';
import styleSheet from './style';

const Splash = ({ navigation }) => {
  useEffect(() => {
    getPassphrase()
      .then(passphrase => {
        // TODO: loadWallet from here
        if (passphrase) {
          navigation.navigate(ROUTE_NAMES.Home);
        } else {
          navigation.navigate(ROUTE_NAMES.CreatePassword);
        }
      })
      .catch(() => {
        Toast.showError('Something went wrong! Please restart your app');
      });
  }, []);

  return (
    <View style={styleSheet.container}>
      <Text style={styleSheet.title}>Loading your wallet...</Text>
      <ActivityIndicator size='large' />
    </View>
  );
};

Splash.propTypes = {
  navigation: PropTypes.object
};

export default Splash;