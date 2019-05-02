import React, { useEffect } from 'react';
import { Text, View } from '@src/components/core';
import ROUTE_NAMES from '@src/router/routeNames';

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(ROUTE_NAMES.Login);
    }, 100);
  }, []);

  return (
    <View>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;