import React from 'react';
import PropTypes from 'prop-types';
import { Button, Text, View } from '@core';
import { ROUTE_NAMES } from '@src/router';
import { login } from '@src/services/auth';

const handleLogin = async () => {
  await login({ username: 'User', password: 'p' });
};

const Login = ({ navigation }) => (
  <View>
    <Text>Login</Text>
    <Button
      onPress={() => {
        handleLogin().then(() => {
          navigation.navigate(ROUTE_NAMES.Splash);
        });
      }}
      title="LOGIN"
    />
  </View>
);

Login.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default Login;