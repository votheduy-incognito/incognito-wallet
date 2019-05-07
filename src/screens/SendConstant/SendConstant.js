import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, CheckBoxField } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';

const initialFormValues = {
  isPrivacy: false,
  amount: '1',
  fee: '0.2'
};

const SendConstant = ({ balance }) => {
  const handleSend = (values) => {
    try {
      // TODO
      console.log(values);
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  return (
    <ScrollView>
      <Container style={styleSheet.container}>
        <Text style={styleSheet.title}>Send Constant</Text>
        <Text>
          Balance: { formatUtil.amount(balance) } {CONSTANT_COMMONS.CONST_SYMBOL}
        </Text>
        <Form initialValues={initialFormValues} onSubmit={handleSend} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
          <FormTextField name='fromAddress' placeholder='From Address' editable={false} />
          <CheckBoxField name='isPrivacy' label='Is Privacy' />
          <FormTextField name='toAddress' placeholder='To Address' />
          <FormTextField name='amount' placeholder='Amount' />
          <FormTextField name='fee' placeholder='Min Fee' />
          <FormSubmitButton title='SEND' style={styleSheet.submitBtn} />
        </Form>
        <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
      </Container>
    </ScrollView>
  );
};

SendConstant.defaultProps = {
  balance: 0
};

SendConstant.propTypes = {
  balance: PropTypes.number
};

export default SendConstant;