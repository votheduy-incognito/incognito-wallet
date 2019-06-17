import React from 'react';
import PropTypes from 'prop-types';
import { Container, Form, FormTextField, FormSubmitButton } from '@src/components/core';
import formValidate from './formValidate';
import styleSheet from './style';

const SubscribeEmail = ({ onSubscribe }) => (
  <Container style={styleSheet.container}>
    <Form onSubmit={onSubscribe} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
      <FormTextField name='email' placeholder='Subscribe your email' autoCompleteType='email' keyboardType='email-address' />
      <FormSubmitButton title='Subscribe' style={styleSheet.submitBtn} />
    </Form>
  </Container>
);

SubscribeEmail.propTypes = {
  onSubscribe: PropTypes.func
};

export default SubscribeEmail;