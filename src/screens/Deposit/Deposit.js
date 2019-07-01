import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, Toast } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { getErrorMessage } from '@src/services/errorHandler';
import style from './style';
import formValidate from './formValidate';

const initialFormValues = {
  amount: '0',
};

class Deposit extends React.Component {
  handleSubmit = values => {
    const { handleGenAddress } = this.props;
    const { amount } = values;
    handleGenAddress(amount)
      .catch(e => {
        Toast.showError(getErrorMessage(e));
      });
  }

  render() {
    const { depositAddress } = this.props;
    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          {depositAddress && <QrCodeAddress data={depositAddress} />}
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
            viewProps={{ style: style.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='amount' placeholder='Amount' />
            <FormSubmitButton title='CONFIRM' style={style.submitBtn} />
          </Form>
        </Container>
      </ScrollView>
    );
  }
}

Deposit.defaultProps = {
  depositAddress: null
};

Deposit.propTypes = {
  depositAddress: PropTypes.string
};

export default Deposit;
