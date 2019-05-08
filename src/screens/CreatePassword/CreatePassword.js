import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import { savePassword } from '@src/services/wallet/passwordService';
import { initWallet } from '@src/services/wallet/WalletService';
import ROUTE_NAMES from '@src/router/routeNames';
import formValidate from './formValidate';
import styleSheet from './style';

const CreatePassword = ({ navigation }) => {
  const goHome = () => {
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  const handleCreateWallet = async ({ password }) => {
    try {
      await savePassword(password);
      Toast.showInfo('Your password was saved!');

      await initWallet();
      Toast.showInfo('Your wallet was created!');
      goHome();
    } catch (e) {
      Toast.showError(e.message);
    }
  };
 
  return (
    <Container style={styleSheet.container}>
      <Text style={styleSheet.title}>Create Your Wallet</Text>
      <Text>The decentralized web awaits</Text>
      <Form onSubmit={handleCreateWallet} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
        <FormTextField name='password' placeholder='Enter your password' textContentType='password' secureTextEntry />
        <FormSubmitButton title='Create' style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};

CreatePassword.propTypes = {
  navigation: PropTypes.object
};

export default CreatePassword;