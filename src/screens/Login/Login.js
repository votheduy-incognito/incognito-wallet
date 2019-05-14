import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import { connect } from 'react-redux';
import ROUTE_NAMES from '@src/router/routeNames';
import { reloadWallet } from '@src/redux/actions/wallet';
import formValidate from './formValidate';
import styleSheet from './style';

const Login = ({ navigation, reloadWallet }) => {
  const goHome = () => {
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  const goCreatePassword = () => {
    navigation.navigate(ROUTE_NAMES.CreatePassword);
  };

  const handleLogin = async ({ password }) => {
    try {
      const wallet = await reloadWallet(password);

      if (wallet){
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
  navigation: PropTypes.object,
  reloadWallet: PropTypes.func
};

const mapDispatch = { reloadWallet };

export default connect(null, mapDispatch)(Login);