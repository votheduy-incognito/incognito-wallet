import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';

const ImportAccount = ({ navigation }) => {
  const goBack = () => {
    navigation.popToTop();
  };

  const handleImportAccount = async ({ accountName }) => {
    try {
      Toast.showInfo(`Your account ${accountName} was import!`);
      goBack();
    } catch (e) {
      Toast.showError(e.message);
    }
  };
 
  return (
    <Container style={styleSheet.container}>
      <Text style={styleSheet.title}>Import Account</Text>
      <Text>* Imported accounts will not be associated with your originally created Constant account seedphrase.</Text>
      <Form onSubmit={handleImportAccount} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
        <FormTextField name='accountName' placeholder='Account Name' />
        <FormTextField name='privateKey' placeholder='Privacy Key' />
        <FormSubmitButton title='IMPORT ACCOUNT' style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};

ImportAccount.propTypes = {
  navigation: PropTypes.object
};

export default ImportAccount;