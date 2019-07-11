import React from 'react';
import PropTypes from 'prop-types';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, Toast, Text } from '@src/components/core';
import EstimateFee from '@src/components/EstimateFee';
import convertUtil from '@src/utils/convert';
import { debounce } from 'lodash';
import { amount as amountValidation } from '@src/components/core/formik/validator';
import { getErrorMessage, messageCode } from '@src/services/errorHandler';
import tokenData from '@src/constants/tokenData';
import formatUtil from '@src/utils/format';
import style from './style';
import createFormValidate from './formValidate';

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
      formValidate: createFormValidate(),
    };

    this.form = null;
    this.handleEstFee = debounce(this.handleEstFee.bind(this), 1000);
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    const maxAmount = convertUtil.toHumanAmount(selectedPrivacy?.amount, selectedPrivacy?.symbol);

    this.setFormValidation({ maxAmount });
  }

  setFormValidation = ({ maxAmount }) => {
    this.setState({
      formValidate: createFormValidate({ amountValidation: amountValidation({ max: maxAmount }) }),
    });
  }

  handleEstFee = async () => {
    try {
      const { values, errors } = this.form;
      const { amount } = values;

      if (errors?.amount || errors?.toAddress){
        return;
      }

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
    const { humanFee, feeLevel, formValidate } = this.state;
    const { selectedPrivacy, withdrawData } = this.props;
    const totalFee = (humanFee * feeLevel) + humanFee;
    const types = [selectedPrivacy?.symbol, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];
    
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
            <EstimateFee
              onRef={com => this.estimateFeeCom = com}
              minFee={withdrawData?.feeCreateTx}
              onSelectFee={this.handleSelectFee}
              onEstimateFee={this.handleEstimateFee}
              types={types}
            />
            {humanFee > 0 && <Text>Fee: {totalFee} {tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY} (include withdraw fee {humanFee} {tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY})</Text>}
            <FormSubmitButton title='CONFIRM' style={style.submitBtn} />
          </Form>
        </Container>
      </ScrollView>
    );
  }
}

Withdraw.propTypes = {
  withdrawData: PropTypes.object.isRequired,
  handleEstimateFeeToken: PropTypes.func.isRequired,
  handleGenAddress: PropTypes.func.isRequired,
  handleSendToken: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
};

export default Withdraw;
