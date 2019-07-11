import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, Toast, Text } from '@src/components/core';
import { debounce } from 'lodash';
import { getErrorMessage, messageCode } from '@src/services/errorHandler';
import tokenData from '@src/constants/tokenData';
import formatUtil from '@src/utils/format';
import style from './style';
import formValidate from './formValidate';

const initialFormValues = {
  amount: undefined,
  toAddress: '0xd5808Ba261c91d640a2D4149E8cdb3fD4512efe4',
};

class Withdraw extends React.Component {
  constructor() {
    super();

    this.state = {
      humanFee: null,
      feeLevel: 1,
    };

    this.form = null;
    this.handleEstFee = debounce(this.handleEstFee.bind(this), 1000);
  }

  handleEstFee = async () => {
    try {
      const { values } = this.form;
      const { amount } = values;

      if (!amount) return;

      const { handleEstimateFeeToken } = this.props;
      const humanFee = await handleEstimateFeeToken({ amount });

      this.setState({ humanFee });
    } catch (e) {
      Toast.showError(getErrorMessage(e, { defaultMessage: 'Can not get withdraw fee, please try again' }));
    }
  }

  handleSubmit = async values => {
    try {
      const { humanFee } = this.state;
      const { handleGenAddress, handleSendToken, navigation } = this.props;
      const { amount, toAddress } = values;
      const tempAddress = await handleGenAddress({ amount, paymentAddress: toAddress });
      const res = await handleSendToken({ tempAddress, amount, fee: humanFee });
      
      Toast.showInfo('Withdraw successfully');
      navigation.goBack();
      return res;
    } catch (e) {
      Toast.showError(getErrorMessage(e, { defaultCode: messageCode.code.withdraw_failed }));
    }
  }

  render() {
    const { humanFee, feeLevel } = this.state;
    const { selectedPrivacy } = this.props;
    const totalFee = (humanFee * feeLevel) + humanFee;

    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          <Text>Balance: {formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy?.symbol)} {selectedPrivacy?.symbol}</Text>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleSubmit}
            viewProps={{ style: style.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleEstFee} />
            <FormTextField name='toAddress' placeholder='To Address' />
            {humanFee > 0 && <Text>Fee: {totalFee} {tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY} (include withdraw fee {humanFee} {tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY})</Text>}
            <FormSubmitButton title='CONFIRM' style={style.submitBtn} />
          </Form>
        </Container>
      </ScrollView>
    );
  }
}

Withdraw.propTypes = {
  handleEstimateFeeToken: PropTypes.func.isRequired,
  handleGenAddress: PropTypes.func.isRequired,
  handleSendToken: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
};

export default Withdraw;
