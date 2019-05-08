import React from 'react';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';
import { loadWallet } from '@src/services/wallet/WalletService';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';

const Login = ({ navigation }) => {
  const goHome = () => {
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  const goCreatePassword = () => {
    navigation.navigate(ROUTE_NAMES.CreatePassword);
  };

  const handleLogin = async ({ password }) => {
    try {
      const wallet = await loadWallet(password);

      if (wallet){
        // Todo: save wallet to Redux

        return goHome();
      }

      goCreatePassword();
    } catch (e) {
      Toast.showError('Login failed');
    }
  };

  return (
    <Container style={styleSheet.container}>
      <Text style={styleSheet.title}>Welcome back!</Text>
      <Text>The decentralized web awaits</Text>
      <Form onSubmit={handleLogin} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
        <FormTextField name='password' placeholder='Enter your password' textContentType='password' secureTextEntry />
        <FormSubmitButton title='Login' style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};

Login.propTypes = {
  navigation: PropTypes.object
};

export default Login;