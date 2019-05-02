import React from 'react';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';

const Login = () => {
  const handleLogin = async ({ password }) => {
    try {
      console.log(password);
      // TODO
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
};

export default Login;