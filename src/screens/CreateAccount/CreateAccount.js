import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';

const CreateAccount = ({ navigation }) => {
  const goBack = () => {
    navigation.popToTop();
  };

  const handleCreateAccount = async ({ accountName }) => {
    try {
      Toast.showInfo(`Your account ${accountName} was created!`);
      goBack();
    } catch (e) {
      Toast.showError(e.message);
    }
  };
 
  return (
    <Container style={styleSheet.container}>
      <Text style={styleSheet.title}>Create New Account</Text>
      <Text>* This is some tips that user need to know</Text>
      <Form onSubmit={handleCreateAccount} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
        <FormTextField name='accountName' placeholder='Account Name' />
        <FormSubmitButton title='CREATE ACCOUNT' style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};

CreateAccount.propTypes = {
  navigation: PropTypes.object
};

export default CreateAccount;