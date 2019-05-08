import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, View, ActivityIndicator } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';
import styleSheet from './style';

const Splash = ({ navigation }) => {
  useEffect(() => {
    navigation.navigate(ROUTE_NAMES.Login);
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