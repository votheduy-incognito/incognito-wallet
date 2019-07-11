import React from 'react';
import PropTypes from 'prop-types';
import { amount as amountValidation } from '@src/components/core/formik/validator';
import convertUtil from '@src/utils/convert';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, TouchableOpacity, Text, Toast } from '@src/components/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { openQrScanner } from '@src/components/QrCodeScanner';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import LoadingTx from '@src/components/LoadingTx';
import EstimateFee from '@src/components/EstimateFee';
import { debounce } from 'lodash';
import tokenData from '@src/constants/tokenData';
import { homeStyle } from './style';
import createFormValidate from './formValidate';

const initialFormValues = {
  amount: '1',
  fee: '0.5',
  toAddress: '1Uv3xw8bFCTXC2rK2Bqk9yYnDoexGh47pM2bY13xQ32wUu98HbhXzLhCtKHwFn8S4FymaQ6TgXaiWvnvWywBDdKQkr4BaWWwnyR7znhTZ'
};

class SendCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      feeUnit: null,
      finalFee: null,
      formValidate: createFormValidate(),
    };
    this.form = null;
    this.estimateFeeCom = null;

    this.handleShouldGetFee = debounce(this.handleShouldGetFee.bind(this), 1000);
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    const maxAmount = convertUtil.toHumanAmount(selectedPrivacy?.amount, selectedPrivacy?.symbol);

    this.setFormValidation({ maxAmount });
  }

  componentDidUpdate(prevProps) {
    const { receiptData } = this.props;

    if (receiptData?.txId !== prevProps.receiptData?.txId) {
      openReceipt(receiptData);
    }
  }

  setFormValidation = ({ maxAmount }) => {
    this.setState({
      formValidate: createFormValidate({ amountValidation: amountValidation({ max: maxAmount }) }),
    });
  }

  handleQrScanAddress = () => {
    openQrScanner(data => {
      this.updateFormValues('toAddress', data);
    });
  }

  updateFormValues = (field, value) => {
    if (this.form) {
      this.form.setFieldValue(field, value, true);
    }
  }

  handleShouldGetFee = () => {
    try {
      const { errors, values } = this.form;

      if (errors?.amount || errors?.toAddress){
        return;
      }

      const { amount, toAddress } = values;

      if (amount && toAddress) {
        this.estimateFeeCom?.estimateFee();
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }

  handleEstimateFee = async feeType => {
    try {
      const { values } = this.form;
      const { handleEstimateFee, handleEstimateTokenFee } = this.props;

      if (feeType === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY) {
        await handleEstimateFee(values);
      } else {
        await handleEstimateTokenFee(values);
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }
  
  handleSend = async values => {
    try {
      const { finalFee, feeUnit } = this.state;
      const { handleSend } = this.props;

      if (typeof handleSend === 'function') {
        await handleSend({ ...values, fee: finalFee, feeUnit });
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }

  handleSelectFee = ({ fee, feeUnit }) => {
    this.setState({ finalFee: fee, feeUnit });
  }

  render() {
    const { formValidate, finalFee, feeUnit } = this.state;
    const { minFee, isSending, selectedPrivacy } = this.props;
    const types = [tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];

    if (selectedPrivacy?.symbol !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY) {
      types.unshift(selectedPrivacy?.symbol);
    }

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleSend}
            viewProps={{ style: homeStyle.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField
              name='toAddress'
              placeholder='To Address'
              onFieldChange={this.handleShouldGetFee}
              prependView={(
                <TouchableOpacity onPress={this.handleQrScanAddress}>
                  <MaterialCommunityIcons name='qrcode-scan' size={20} />
                </TouchableOpacity>
              )}
            />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee} />
            <EstimateFee
              onRef={com => this.estimateFeeCom = com}
              minFee={minFee}
              onSelectFee={this.handleSelectFee}
              onEstimateFee={this.handleEstimateFee}
              types={types}
            />
            <FormSubmitButton title='SEND' style={homeStyle.submitBtn} />
          </Form>
          <Text>Fee: {finalFee} {feeUnit}</Text>
          <ReceiptModal />
        </Container>
        { isSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}

SendCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
};

export default SendCrypto;
