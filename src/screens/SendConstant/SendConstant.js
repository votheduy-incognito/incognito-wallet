import { ActivityIndicator, CheckBoxField, Container, Form, FormSubmitButton, FormTextField, ScrollView, Text, Toast, TouchableOpacity } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import { openQrScanner } from '@src/components/QrCodeScanner';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import { CONSTANT_COMMONS } from '@src/constants';
import common from '@src/constants/common';
import ROUTE_NAMES from '@src/router/routeNames';
import Account from '@src/services/wallet/accountService';
import { getEstimateFee } from '@src/services/wallet/RpcClientService';
import { FONT } from '@src/styles';
import convert from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import formValidate from './formValidate';
import styleSheet from './style';

const initialFormValues = {
  isPrivacy: false,
  amount: '1',
  fee: '0.5',
  fromAddress: ''
};

class SendConstant extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues,
      minFee: 0,
      isSending: false,
      isGettingFee: false
    };

    this.handleShouldGetFee = _.debounce(this.handleShouldGetFee, 500);

    this.form = null;
  }

  componentDidMount() {
    const { account } = this.props;

    this.setFormValue({
      ...initialFormValues,
      fromAddress: account?.PaymentAddress,
    });
  }

  setFormValue = (initialFormValues) => {
    this.setState({ initialFormValues });
  }

  updateFormValues = (field, value) => {
    if (this.form) {
      this.form.setFieldValue(field, value, true);
    }
  }

  goHome = () => {
    const { navigation } = this.props;
    navigation.navigate(ROUTE_NAMES.RootApp);
  };

  // estimate fee when user update isPrivacy or amount, and toAddress is not null
  handleEstimateFee = async (values) => {
    const { account, wallet } = this.props;

    const { fromAddress, toAddress, amount, isPrivacy } = values;

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      this.setState({ isGettingFee: true });

      const fee =  await getEstimateFee(fromAddress, toAddress, convert.toMiliConstant(Number(amount)), account.PrivateKey, accountWallet, isPrivacy);
      // set min fee state
      this.setState({minFee: convert.toConstant(fee)});
      // update fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch(e){
      Toast.showError('Error on get estimation fee!');
    } finally {
      this.setState({ isGettingFee: false });
    }
  };

  handleSend = async (values) => {
    const { account, wallet, getBalance } = this.props;

    const { fromAddress, toAddress, amount, isPrivacy, fee } = values;

    const paymentInfos = [{
      paymentAddressStr: toAddress, amount: convert.toMiliConstant(Number(amount))
    }];

    try {
      this.setState({
        isSending: true
      });

      const res = await Account.sendConstant(paymentInfos, convert.toMiliConstant(Number(fee)), isPrivacy, account, wallet);

      if (res.txId) {
        openReceipt({
          txId: res.txId,
          toAddress,
          fromAddress,
          amount: convert.toMiliConstant(Number(amount)),
          amountUnit: CONSTANT_COMMONS.CONST_SYMBOL,
          time: formatUtil.toMiliSecond(res.lockTime),
          fee: convert.toMiliConstant(Number(fee)),
        });

        setTimeout(() => getBalance(account), 10000);
      } else {
        Toast.showError(`Sent failed. Please try again! Err: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      Toast.showError(`Sent failed. Please try again! Err:' ${e.message}`);
    } finally {
      this.setState({ isSending: false });
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.toAddress){
      return;
    }

    const { amount, toAddress, isPrivacy } = values;

    if (amount && toAddress && typeof isPrivacy === 'boolean'){
      this.handleEstimateFee(values);
    }
  }

  onFormValidate = values => {
    const { account } = this.props;
    const errors = {};

    const { amount, fee } = values;
    const { minFee } = this.state;

    if (amount >= convert.toConstant(Number(account.value))) {
      errors.amount = `Must be less than ${convert.toConstant(Number(account.value))} ${common.CONST_SYMBOL}`;
    }

    if (fee < minFee){
      errors.fee = `Must be at least min fee ${minFee} ${common.CONST_SYMBOL}`;
    } 
    
    return errors;
  }

  handleQrScanAddress = () => {
    openQrScanner(data => {
      this.updateFormValues('toAddress', data);
    });
  }

  render() {
    const { account } = this.props;
    const { initialFormValues, isSending, isGettingFee } = this.state;
    const balance = `${formatUtil.amountConstant(account.value) } ${CONSTANT_COMMONS.CONST_SYMBOL}`;
    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Send Constant</Text>
          <Text>
            {`Balance: ${balance}`}
          </Text>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleSend}
            viewProps={{ style: styleSheet.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='fromAddress' placeholder='From Address' editable={false}  />
            <CheckBoxField name='isPrivacy' label='Is Privacy' onFieldChange={this.handleShouldGetFee} />
            <FormTextField
              name='toAddress'
              placeholder='To Address'
              onFieldChange={this.handleShouldGetFee}
              prependView={
                <TouchableOpacity onPress={this.handleQrScanAddress}>
                  <MaterialCommunityIcons name='qrcode-scan' size={FONT.SIZE.large} />
                </TouchableOpacity>
              }
            />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee} />
            <FormTextField
              name='fee'
              placeholder='Min Fee'
              prependView={isGettingFee ? <ActivityIndicator /> : undefined}
            />
            <FormSubmitButton title='SEND' style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
          <ReceiptModal />
        </Container>
        { isSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}
SendConstant.defaultProps = {
  navigation: undefined,
  wallet:  undefined,
  account:  undefined,
  getBalance: PropTypes.func
};
SendConstant.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object),
  wallet:  PropTypes.objectOf(PropTypes.object),
  account:  PropTypes.objectOf(PropTypes.object),
  getBalance: PropTypes.func
};

export default SendConstant;