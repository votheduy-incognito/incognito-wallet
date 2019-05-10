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

const initialFormValues = {
  isPrivacy: false,
  amount: '1',
  fee: '0.5',
  fromAddress: '',
};

class SendConstant extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues
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

  // Todo: estimate fee when user update isPrivacy or amount, and toAddress is not null
  handleEstimateFee = async (values) => {
    const { account, wallet } = this.props;

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      const fee =  await getEstimateFee(values.fromAddress, values.toAddress, Number(values.amount*100), account.PrivateKey, accountWallet, values.isPrivacy);
      // update min fee
      this.updateFormValues('fee', String(fee));
    } catch(e){
      // alert(JSON.stringify(e.stack));
      Toast.showError('Error on get estimation fee!');
    }
  };

  handleSend = async (values) => {
    const { account, wallet } = this.props;

    const paymentInfos = [{
      paymentAddressStr: values.toAddress, amount: Number(values.amount*100)
    }];

    try {
      const res = await Account.sendConstant(paymentInfos, Number(values.fee*100), values.isPrivacy, account, wallet);

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

  shouldGetFee = ({ values, errors }) => {
    if (Object.values(errors).length) {
      return;
    }


    const { toAddress, amount, isPrivacy } = values;

    if (toAddress && amount && typeof isPrivacy === 'boolean') {
      this.handleEstimateFee(values);
    }
  }

  handleFormChange= (prevState, state) => {
    this.shouldGetFee({ values: state?.values, errors: state?.errors });
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