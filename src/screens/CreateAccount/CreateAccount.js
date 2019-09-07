import {
  Container,
  Toast,
  Button,
  View
} from '@src/components/core';
import { Field } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import PropTypes from 'prop-types';
import React from 'react';
import AccountModel from '@src/models/account';
import styleSheet from './style';

const formName = 'createAccount';
const Form = createForm(formName);
const isRequired = validator.required();

const CreateAccount = ({ navigation, accountList, createAccount }) => {
  const goBack = () => {
    navigation.popToTop();
  };

  const handleCreateAccount = async ({ accountName }) => {
    const lowerCase = str => String(str).toLowerCase();
    try {
      if (
        accountList?.find(
          _account => lowerCase(_account.name) === lowerCase(accountName)
        )
      ) {
        throw new Error(
          'You already have an account with this name. Please try another.'
        );
      }

      const account = await createAccount(accountName);

      // switch to this account
      const onSwitchAccount = navigation?.getParam('onSwitchAccount');
      if (typeof onSwitchAccount === 'function') {
        onSwitchAccount(account);
      }

      goBack();
    } catch (e) {
      Toast.showError('You already have an account with this name. Please try another.');
    }
  };

  return (
    <Container style={styleSheet.container}>
      <Form>
        {({ handleSubmit, submitting }) => (
          <View style={styleSheet.form}>
            <Field
              component={InputField}
              name='accountName'
              placeholder='Account Name'
              label='Account Name'
              validate={[isRequired]}
            />
            <Button
              title='Create account'
              style={styleSheet.submitBtn}
              onPress={handleSubmit(handleCreateAccount)}
              isAsync
              isLoading={submitting}
            />
          </View>
        )}
      </Form>
    </Container>
  );
};

CreateAccount.defaultProps = {
  accountList: [],
  createAccount: null
};

CreateAccount.propTypes = {
  navigation: PropTypes.object.isRequired,
  accountList: PropTypes.array,
  createAccount: PropTypes.func
};

export default CreateAccount;
