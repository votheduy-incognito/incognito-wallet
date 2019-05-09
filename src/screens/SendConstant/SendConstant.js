import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, CheckBoxField, Button } from '@src/components/core';
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

    this.form = null;
  }

  componentDidMount() {
    const { account } = this.props;

    this.setFormValue({
      ...initialFormValues,
      fromAddress: account?.PaymentAddress,
      toAddress: account?.PaymentAddress,
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

  handleEstimateFee = async () => {
    const { account, wallet } = this.props;
    const values = this.form;

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      const fee =  await getEstimateFee(values.fromAddress, values.toAddress, values.amount, account.PrivateKey, accountWallet, values.isPrivacy);
      // update min fee
      this.updateFormValues('fee', fee);
    } catch(e){
      // alert(JSON.stringify(e.stack));
      Toast.showError('Error on get estimation fee!');
    }
  };

  handleSend = async (values) => {
    const { account, wallet } = this.props;

    const paymentInfos = [{
      paymentAddressStr: values.toAddress, amount: values.amount
    }];

    try {
      const res = await Account.sendConstant(paymentInfos, values.fee, values.isPrivacy, account, wallet);

      if (res.txId) {
        Toast.showInfo('Sent successfully. TxId: ', res.txId);
        this.goHome();
      } else {
        Toast.showError('Sent failed. Please try again! Err:' + res.err.Message);
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  };

  render() {
    const { account } = this.props;
    const { initialFormValues } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Send Constant</Text>
          <Text>
            Balance: { formatUtil.amount(account.value) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form formRef={form => this.form = form} initialValues={initialFormValues} onSubmit={this.handleSend} viewProps={{ style: styleSheet.form }} validationSchema={formValidate}>
            <FormTextField name='fromAddress' placeholder='From Address' editable={false}  />
            <CheckBoxField name='isPrivacy' label='Is Privacy' />
            <FormTextField name='toAddress' placeholder='To Address' />
            <FormTextField name='amount' placeholder='Amount' />
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title='SEND' style={styleSheet.submitBtn} />
          </Form>
          {/* This button just for testing */}
          <Button title='Estimate fee' onPress={this.handleEstimateFee}></Button>
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