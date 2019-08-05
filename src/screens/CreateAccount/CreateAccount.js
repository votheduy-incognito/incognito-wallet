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
import styleSheet from './style';

const formName = 'createAccount';
const Form = createForm(formName);

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
          'This account name was created! Please try another one'
        );
      }

      await createAccount(accountName);
      goBack();
    } catch (e) {
      Toast.showError(e.message);
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
              validate={[validator.required]}
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
