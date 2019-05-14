import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, CheckBoxField } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import { getEstimateFeeToDefragment } from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import _ from 'lodash';
import common from '@src/constants/common';

const initialValues = {
  fromAddress: '',
  isPrivacy: CONSTANT_COMMONS.DEFRAGMENT_SET_DEFAULT_PRIVACY,
  amount: String(CONSTANT_COMMONS.DEFRAGMENT_DEFAULT_AMOUNT),
  fee: String(CONSTANT_COMMONS.DEFRAGMENT_MIN_FEE)
};

class Defragment extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues: initialValues,
      minFee: 0
    };
    this.form = null;
    this.handleShouldGetFee = _.debounce(::this.handleShouldGetFee, 500);
  }

  componentDidMount = async () => {
    const { account } = this.props;
    this.updateFormValues('fromAddress', account?.PaymentAddress);
  }

  updateFormValues = (field, value) => {
    if (this.form) {
      return this.form.setFieldValue(field, value, true);
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  }

  // estimate fee when user update isPrivacy or amount, and fromAddress is not null
  handleEstimateFee = async (values) => {
    const { account, wallet } = this.props;
    const accountWallet = wallet.getAccountByName(account.name);

    try{
      const fee =  await getEstimateFeeToDefragment(values.fromAddress, convert.toMiliConstant(Number(values.amount)), account.PrivateKey, accountWallet, values.isPrivacy);
      // set min fee state
      this.setState({minFee: convert.toConstant(fee)});
      // update fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch(e){
      Toast.showError(`Error on get estimation fee!, ${e}`);
    }
  };

  handleDefragment = async (values) => { 
    try {
      const { account, wallet } = this.props;
      const { amount, fee, isPrivacy } = values;
      try {
        const res = await Account.defragment(convert.toMiliConstant(Number(amount)), convert.toMiliConstant(Number(fee)), isPrivacy, account, wallet);

        if (res.txId) {
          Toast.showInfo(`Defragment successfully. TxId: ${res.txId}`);
          this.goBack();
        } else {
          Toast.showError(`Defragment failed. Please try again! Err: ${res.err.Message || res.err}`);
        }
      } catch (e) {
        Toast.showError(`Defragment failed. Please try again! Err: ${e.message}`);
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.fromAddress){
      return;
    }

    const { amount, fromAddress, isPrivacy } = values;

    if (amount && fromAddress && typeof isPrivacy === 'boolean'){
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

  render() {
    const { account } = this.props;
    const { initialFormValues } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Defragment</Text>
          <Text>
            Balance: { formatUtil.amountConstant(account.value) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form 
            formRef={form => this.form = form} 
            initialValues={initialFormValues} 
            onSubmit={this.handleDefragment} 
            viewProps={{ style: styleSheet.form }} 
            // validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='fromAddress' placeholder='From Address' editable={false}  onFieldChange={this.handleShouldGetFee}/>
            <CheckBoxField name='isPrivacy' label='Is Privacy' onFieldChange={this.handleShouldGetFee} />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee}/>
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title='DEFRAGMENT' style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
        </Container>
      </ScrollView>
    );
  }
}

Defragment.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object,
  wallet: PropTypes.object
};

export default Defragment;