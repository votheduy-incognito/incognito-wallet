import React from 'react';
import { Text, Container, Form, FormTextField, FormSubmitButton } from '@core';
import { login } from '@src/services/auth';
import formValidate from './formValidate';
import styleSheet from './style';

const handleLogin = async () => {
  await login({ username: 'User', password: 'p' });
};

const Login = () => (
  <Container style={styleSheet.container}>
    <Text style={styleSheet.title}>Welcome back!</Text>
    <Text>The decentralized web awaits</Text>

    <Form onSubmit={handleLogin} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
      <FormTextField name='password' placeholder='Enter your password' textContentType='password' secureTextEntry />
      <FormSubmitButton title='Login' style={styleSheet.submitBtn} />
    </Form>
  </Container>
);

Login.propTypes = {
};

export default Login;