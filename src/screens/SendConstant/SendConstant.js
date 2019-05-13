import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, CheckBoxField } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import ROUTE_NAMES from '@src/router/routeNames';
import { getEstimateFee } from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';

const initialFormValues = {
  isPrivacy: false,
  amount: '1',
  minFee: '0.5',
  fee: '0.5',
  fromAddress: '',
};

class SendConstant extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues,
    };

    this.handleEstimateFee = _.debounce(::this.handleEstimateFee, 500);

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

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      const fee =  await getEstimateFee(values.fromAddress, values.toAddress, convert.toMiliConstant(Number(values.amount)), account.PrivateKey, accountWallet, values.isPrivacy);
      // set min fee state
      this.setState({minFee: convert.toConstant(fee)});

      // update fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch(e){
      Toast.showError('Error on get estimation fee!');
    }
  };

  handleSend = async (values) => {
    const { account, wallet } = this.props;

    const paymentInfos = [{
      paymentAddressStr: values.toAddress, amount: convert.toMiliConstant(Number(values.amount))
    }];

    try {
      const res = await Account.sendConstant(paymentInfos, convert.toMiliConstant(Number(values.fee)), values.isPrivacy, account, wallet);

      if (res.txId) {
        Toast.showInfo(`Sent successfully. TxId: ${res.txId}`);
        this.goHome();
      } else {
        Toast.showError(`Sent failed. Please try again! Err: ${res.err || res.err.Message}`);
      }
    } catch (e) {
      Toast.showError(`Sent failed. Please try again! Err:' ${e.message}`);
    }
  };

  shouldGetFee = async ({ values, errors }) => {
    if (Object.values(errors).length) {
      return;
    }

    const { toAddress, amount, isPrivacy } = values;

    if (toAddress && amount && typeof isPrivacy === 'boolean') {
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
          <Text style={styleSheet.title}>Send Constant</Text>
          <Text>
            Balance: { formatUtil.amountConstant(account.value) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleSend}
            viewProps={{ style: styleSheet.form }}
            validationSchema={formValidate}
            onFormChange={this.handleFormChange}
            validate={this.onFormValidate}
          >
            <FormTextField name='fromAddress' placeholder='From Address' editable={false}  />
            <CheckBoxField name='isPrivacy' label='Is Privacy' />
            <FormTextField name='toAddress' placeholder='To Address' />
            <FormTextField name='amount' placeholder='Amount' />
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title='SEND' style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
        </Container>
      </ScrollView>
    );
  }
}

SendConstant.propTypes = {
  navigation: PropTypes.object,
  wallet: PropTypes.object,
  account: PropTypes.object,
};

export default SendConstant;