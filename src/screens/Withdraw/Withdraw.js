import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, Toast, Text } from '@src/components/core';
import { getErrorMessage, messageCode } from '@src/services/errorHandler';
import tokenData from '@src/constants/tokenData';
import style from './style';
import formValidate from './formValidate';

const initialFormValues = {
  amount: '0',
  toAddress: '0xd5808Ba261c91d640a2D4149E8cdb3fD4512efe4',
};

class Withdraw extends React.Component {
  constructor() {
    super();

    this.state = {
      humanFee: null,
    };
  }
  handleSubmit = async values => {
    try {
      const { handleGenAddress, handleSendToken, handleEstimateFeeToken } = this.props;
      const { amount, toAddress } = values;
      const tempAddress = await handleGenAddress({ amount, paymentAddress: toAddress });
      const humanFee = await handleEstimateFeeToken({ amount, tempAddress });
      const res = await handleSendToken({ tempAddress, amount, fee: humanFee });

      this.setState({ humanFee });
      Toast.showInfo('Withdraw successfully');
      return res;
    } catch (e) {
      Toast.showError(getErrorMessage(e, { defaultCode: messageCode.code.withdraw_failed }));
    }
  }

  render() {
    const { humanFee } = this.state;

    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
            viewProps={{ style: style.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='amount' placeholder='Amount' />
            <FormTextField name='toAddress' placeholder='To Address' />
            {humanFee > 0 && <Text>Fee: {humanFee} {tokenData.SYMBOL.MAIN_PRIVACY}</Text>}
            <FormSubmitButton title='CONFIRM' style={style.submitBtn} />
          </Form>
        </Container>
      </ScrollView>
    );
  }
}

Withdraw.defaultProps = {
  depositAddress: null
};

Withdraw.propTypes = {
  depositAddress: PropTypes.string
};

export default Withdraw;
