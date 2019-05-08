import React from 'react';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';
import { getPassphrase } from '@src/services/wallet/passwordService';
import { loadWallet } from '@src/services/wallet/WalletService';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';

const Login = ({ navigation }) => {
  const goHome = () => {
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  const handleLogin = async ({ password }) => {
    try {
      console.log('password', password);

      const oldPassword = await getPassphrase();
      console.log('oldPassword', oldPassword);

      if (!oldPassword){
        Toast.showInfo('Have no wallet!');
      }

      if (password === oldPassword){
        // load wallet
        const wallet = await loadWallet(password);
        console.log('Wallet after login: ', wallet);

        // Todo: save wallet to Redux
        
        goHome();
      } else{
        Toast.showError('Login failed!');
      }
    } catch (e) {
      Toast.showError(e.message);
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