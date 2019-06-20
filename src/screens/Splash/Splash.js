import { ActivityIndicator, Text, Toast, View } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import serverService from '@src/services/wallet/Server';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import styleSheet from './style';

const Splash = ({ navigation }) => {
  const initServer = async () => {
    try {
      if (!(await serverService.get())) {
        return serverService.setDefaultList();
      }
    } catch {
      Toast.showError('Error occurs while setting server list');
    }
  };
  useEffect(() => {
    initServer().then(() => {
      navigation.navigate(ROUTE_NAMES.Login);
    });
  }, []);

  return (
    <View style={styleSheet.container}>
      <Text style={styleSheet.title}>Loading your wallet...</Text>
      <ActivityIndicator size="large" />
    </View>
  );
};
Splash.defaultProps = {
  navigation: undefined
};
Splash.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object)
};

export default Splash;
