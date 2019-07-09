import React from 'react';
import PropTypes from 'prop-types';
import { amount as amountValidation } from '@src/components/core/formik/validator';
import convertUtil from '@src/utils/convert';
import { Container, ScrollView, Form, FormSubmitButton, FormTextField, TouchableOpacity, ActivityIndicator, Toast } from '@src/components/core';
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
  toAddress: ''
};

class SendCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      finalFee: null,
      formValidate: createFormValidate(),
    };
    this.form = null;

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

  handleShouldGetFee = async () => {
    try {
      const { errors, values } = this.form;

      if (errors?.amount || errors?.toAddress){
        return;
      }

      const { amount, toAddress } = values;

      if (amount && toAddress){
        console.log(amount, toAddress);
        const { handleEstimateFee } = this.props;
        await handleEstimateFee(values);
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }
  
  handleSend = async values => {
    try {
      const { finalFee } = this.state;
      const { handleSend } = this.props;

      if (typeof handleSend === 'function') {
        await handleSend({ ...values, fee: finalFee });
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }

  handleSelectFee = fee => {
    this.setState({ finalFee: fee });
  }

  render() {
    const { formValidate } = this.state;
    const { isGettingFee, minFee, isSending } = this.props;

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
            <EstimateFee fee={minFee} feeUnit={tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY} onSelectFee={this.handleSelectFee} />
            <FormSubmitButton title='SEND' style={homeStyle.submitBtn} />
          </Form>
          {isGettingFee && <ActivityIndicator />}
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
