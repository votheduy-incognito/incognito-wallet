import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';

const CreateAccount = ({ navigation, accountList, createAccount }) => {
  const goBack = () => {
    navigation.popToTop();
  };

  const handleCreateAccount = async ({ accountName }) => {
    const lowerCase = str => String(str).toLowerCase();
    try {
      if (accountList?.find(_account => lowerCase(_account.name) === lowerCase(accountName))) {
        throw new Error('This account name was created! Please try another one');
      }

      await createAccount(accountName);
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
  navigation: PropTypes.object,
  accountList: PropTypes.array,
  createAccount: PropTypes.func
};

export default CreateAccount;