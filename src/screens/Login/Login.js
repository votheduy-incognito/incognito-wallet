import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, View } from 'react-native';
import { ROUTE_NAMES } from '@src/router';

const Login = ({ navigation }) => (
  <View>
    <Text>Login</Text>
    <Button
      onPress={() => navigation.navigate(ROUTE_NAMES.Splash)}
      title="LOGIN"
    />
  </View>
);

Login.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Login;