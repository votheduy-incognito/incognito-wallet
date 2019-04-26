import React, { useEffect } from 'react';
import { Text, View } from '@core';
import { ROUTE_NAMES } from '@src/router';

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(ROUTE_NAMES.Home);
    }, 1000);
  }, []);

  return (
    <View>
      <Text>Splash</Text>
    </View>
  );
};

export default Splash;