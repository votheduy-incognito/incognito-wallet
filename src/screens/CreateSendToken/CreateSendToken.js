import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';
import ROUTE_NAMES from '@src/router/routeNames';
import { getEstimateFeeForSendingToken } from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import common from '@src/constants/common';
import ReceiptModal from '@src/components/Receipt';
import Token from '@src/services/wallet/tokenService';

const initialFormValues = {
  fee: '0.5',
  fromAddress: ''
};

class CreateSendToken extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues,
      minFee: 0,
    };

    this.handleShouldGetFee = _.debounce(::this.handleShouldGetFee, 500);

    this.form = null;
  }

  componentDidMount() {
    const { account, isCreate } = this.props;

    let toAddress = '';
    if (isCreate){
      toAddress = account?.PaymentAddress;
    }
    
    this.setFormValue({
      ...initialFormValues,
      fromAddress: account?.PaymentAddress,
      toAddress,
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
    const { account, wallet, isPrivacy, isCreate } = this.props;

    const { fromAddress, toAddress, name, symbol, amount } = values;
    
    const type = isCreate ? CONSTANT_COMMONS.INIT_TOKEN : CONSTANT_COMMONS.SEND_TOKEN;

    const tokenObject = {
      Privacy : isPrivacy,
      TokenID:  '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: type,
      TokenAmount: Number(amount),
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: Number(amount)
      }
    };

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      const fee =  await getEstimateFeeForSendingToken(fromAddress, toAddress, amount, tokenObject, account.PrivateKey, accountWallet);
      // set min fee state
      this.setState({minFee: convert.toConstant(fee)});
      // update fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch(e){
      Toast.showError(`Error on get estimation fee! ${e}`);
    }
  };

  handleCreateSendToken = async (values) => {
    const { account, wallet, isPrivacy, isCreate } = this.props;

    const { toAddress, name, symbol, amount, fee } = values;

    const type = isCreate ? CONSTANT_COMMONS.INIT_TOKEN : CONSTANT_COMMONS.SEND_TOKEN;

    const text = isCreate ? 'Create' : 'Send';

    const tokenObject = {
      Privacy : isPrivacy,
      TokenID:  '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: type,
      TokenAmount: Number(amount),
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: Number(amount)
      }
    };

    try {
      let res;
      if (!isPrivacy){
        res = await Token.createSendCustomToken(tokenObject, convert.toMiliConstant(Number(fee)), account, wallet);
      } else{
        res = await Token.createSendPrivacyCustomToken(tokenObject, convert.toMiliConstant(Number(fee)), account, wallet);
      }

      if (res.txId) {
        Toast.showInfo(`${text} token successfully`);
      } else {
        Toast.showError(`${text} token failed. Please try again! Err: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      Toast.showError(`${text} token failed. Please try again! Err:' ${e.message}`);
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.toAddress){
      return;
    }

    const { fromAddress, toAddress, name, symbol, amount } = values;

    if (amount && fromAddress && toAddress && name && symbol){
      this.handleEstimateFee(values);
    }
  }

  onFormValidate = values => {
    const errors = {};

    const { fee } = values;
    const { minFee } = this.state;


    if (fee < minFee){
      errors.fee = `Must be at least min fee ${minFee} ${common.CONST_SYMBOL}`;
    } 
    
    return errors;
  }

  render() {
    const { account, isCreate } = this.props;
    const { initialFormValues } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>{isCreate?'Create':'Send'} Token</Text>
          <Text>
            Balance: { formatUtil.amountConstant(account.value) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleCreateSendToken}
            viewProps={{ style: styleSheet.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='fromAddress' placeholder='From Address' editable={false}  />
            <FormTextField name='toAddress' placeholder='To Address' />
            <FormTextField name='name' placeholder='Name' />
            <FormTextField name='symbol' placeholder='Symbol' />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee}/>
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title={isCreate?'CREATE':'SEND'} style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
          <ReceiptModal />
        </Container>
        
      </ScrollView>
    );
  }
}

CreateSendToken.propTypes = {
  navigation: PropTypes.object,
  wallet: PropTypes.object,
  account: PropTypes.object,
  isPrivacy: PropTypes.bool,
  isCreate: PropTypes.bool
};

export default CreateSendToken;