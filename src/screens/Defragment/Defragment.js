import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, CheckBoxField } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import { getEstimateFeeToDefragment } from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import _ from 'lodash';

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
      initialFormValues: initialValues
    };
    this.form = null;
    this.handleEstimateFee = _.debounce(::this.handleEstimateFee, 500);
  }

  componentDidMount() {
    const { account } = this.props;
    this.updateFormValues('fromAddress', account.PaymentAddress);
  }

  updateFormValues = (field, value) => {
    if (this.form) {
      this.form.setFieldValue(field, value, true);
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
      Toast.showError('Error on get estimation fee!');
    }
  };

  handleDefragment = async (values) => {
    try {
      // Account.defragment()
      const { account, wallet } = this.props;
      const { amount, fee, isPrivacy } = values;

      try {
        const res = await Account.defragment(amount, fee, isPrivacy, account, wallet);

        if (res.txId) {
          Toast.showInfo(`Defragment successfully. TxId: ${res.txId}`);
          this.goBack();
        } else {
          Toast.showError(`Defragment failed. Please try again! Err: ${res.err.Message || res.err}`);
        }
      } catch (e) {
        Toast.showError(`Defragment failed. Please try again! Err: ${e.message}`);
      }
      Toast.showInfo('Defragment completed!');
      this.goBack();
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  shouldGetFee = async ({ values, errors }) => {
    if (Object.values(errors).length) {
      return;
    }

    const { fromAddress, amount, isPrivacy } = values;

    if (fromAddress && amount && typeof isPrivacy === 'boolean') {
      await this.handleEstimateFee(values);
    }
  }

  handleFormChange = async (prevState, state) => {
    await this.shouldGetFee({ values: state?.values, errors: state?.errors });
  }

  onFormValidate = values => {
    const { account } = this.props;
    const errors = {};

    if (values.amount >= account.value) {
      errors.amount = `Must be less than ${values?.amount}`;
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
            validationSchema={formValidate}
            onFormChange={this.handleFormChange}
            validate={this.onFormValidate}
          >
            <FormTextField name='fromAddress' placeholder='From Address' editable={false} />
            <CheckBoxField name='isPrivacy' label='Is Privacy' />
            <FormTextField name='amount' placeholder='Amount' />
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title='DEFRAGMENT' style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
        </Container>
      </ScrollView>
    );
  }
}

Defragment.defaultProps = {
  balance: 0,
  fromAddress: 'default_address'
};

Defragment.propTypes = {
  navigation: PropTypes.object.isRequired,
  account: PropTypes.object,
  wallet: PropTypes.object
};

export default Defragment;