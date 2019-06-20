import {
  Container,
  Form,
  FormSubmitButton,
  FormTextField,
  Text,
  Toast
} from '@src/components/core';
import { reloadWallet } from '@src/redux/actions/wallet';
import ROUTE_NAMES from '@src/router/routeNames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
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

      if (wallet) {
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
      <Form
        onSubmit={handleLogin}
        viewProps={{ style: styleSheet.form }}
        validationSchema={formValidate}
      >
        <FormTextField
          name="password"
          placeholder="Enter your password"
          textContentType="password"
          secureTextEntry
        />
        <FormSubmitButton title="Login" style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};
Login.defaultProps = {
  navigation: undefined,
  reloadWallet: undefined
};

Login.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object),
  reloadWallet: PropTypes.func
};

const mapDispatch = { reloadWallet };

export default connect(
  null,
  mapDispatch
)(Login);
