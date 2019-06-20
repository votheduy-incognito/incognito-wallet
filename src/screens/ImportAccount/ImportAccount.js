import {
  Container,
  Form,
  FormSubmitButton,
  FormTextField,
  Text,
  Toast
} from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import formValidate from './formValidate';
import styleSheet from './style';

const ImportAccount = ({ navigation, accountList, importAccount }) => {
  const goBack = () => {
    navigation.popToTop();
  };

  const handleImportAccount = async ({ accountName, privateKey }) => {
    const lowerCase = str => String(str).toLowerCase();
    try {
      if (
        accountList.find(
          _account => lowerCase(_account.name) === lowerCase(accountName)
        )
      ) {
        throw new Error(
          'This account name was created! Please try another one'
        );
      }

      await importAccount({ privateKey, accountName });
      goBack();
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  return (
    <Container style={styleSheet.container}>
      <Text style={styleSheet.title}>Import Account</Text>
      <Text>
        * Imported accounts will not be associated with your originally created
        Constant account seedphrase.
      </Text>
      <Form
        onSubmit={handleImportAccount}
        viewProps={{ style: styleSheet.form }}
        validationSchema={formValidate}
      >
        <FormTextField name="accountName" placeholder="Account Name" />
        <FormTextField name="privateKey" placeholder="Private Key" />
        <FormSubmitButton title="IMPORT ACCOUNT" style={styleSheet.submitBtn} />
      </Form>
    </Container>
  );
};

ImportAccount.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object)
};

export default ImportAccount;
