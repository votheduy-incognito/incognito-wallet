import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, PickerField, Picker } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import formValidate from './formValidate';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import { getStakingAmount, getEstimateFee } from '@src/services/wallet/RpcClientService';

const initialValues = {
  stakingType: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
  toAddress: CONSTANT_COMMONS.STAKING_ADDRESS,
  fromAddress: '',
  amount: String(CONSTANT_COMMONS.STAKING_AMOUNT),
  fee: String(CONSTANT_COMMONS.STAKING_MIN_FEE)
};

const validator = formValidate({ minFee: CONSTANT_COMMONS.STAKING_MIN_FEE });

class Staking extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues: initialValues
    };
    this.form = null;
  }

  componentDidMount = async () => {
    const { account } = this.props;
    this.updateFormValues('fromAddress', account?.PaymentAddress);
    await this.handleGetAmountStaking();
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

  // Todo: update amount staking when change stakingType
  handleGetAmountStaking = async () => {
    const { stakingType } = this.form;

    try{
      const amount = await getStakingAmount(stakingType);
      this.updateFormValues('amount', amount);
    } catch(e){
      Toast.showError('Get amount staking failed!');
    }
  }

  // Todo: call this function when user change stakingType
  handleEstimateFee = async () => {
    const { account, wallet } = this.props;
    const values = this.form;

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      const fee =  await getEstimateFee(values.fromAddress, values.toAddress, values.amount, account.PrivateKey, accountWallet, false);
      // update min fee
      this.updateFormValues('fee', fee);
    } catch(e){
      // alert(JSON.stringify(e.stack));
      Toast.showError('Error on get estimation fee!');
    }
  };

  handleStaking = async (values) => {
    const { account, wallet } = this.props;

    const param = { type: Number(values.stakingType), burningAddress: CONSTANT_COMMONS.STAKING_ADDRESS };

    try {
      const res = await Account.staking(param, values.fee, account, wallet);

      if (res.txId) {
        Toast.showInfo('Staking successfully. TxId: ', res.txId);
        this.goHome();
      } else {
        Toast.showError('Staking failed. Please try again! Err:' + res.err.Message);
      }
    } catch (e) {
      Toast.showError('Staking failed. Please try again! Err:' + e.message);
    }
  };

  render() {
    const { account } = this.props;
    const { initialFormValues } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Staking</Text>
          <Text>
            Balance: { formatUtil.amount(account.value) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form formRef={form => this.form = form} initialValues={initialFormValues} onSubmit={this.handleStaking} viewProps={{ style: styleSheet.form }} validationSchema={validator}>
            <FormTextField name='fromAddress' placeholder='From Address' editable={false} />
            <PickerField name='stakingType'>
              <Picker.Item label="Shard Type" value={CONSTANT_COMMONS.STAKING_TYPES.SHARD} />
              <Picker.Item label="Beacon Type" value={CONSTANT_COMMONS.STAKING_TYPES.BEACON} />
            </PickerField>
            <FormTextField name='toAddress' placeholder='To Address' editable={false} />
            <FormTextField name='amount' placeholder='Amount' editable={false} />
            <FormTextField name='fee' placeholder='Min Fee' />
            <FormSubmitButton title='STAKING' style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
        </Container>
      </ScrollView>
    );
  }
}

Staking.defaultProps = {
  balance: 0,
  fromAddress: 'default_address'
};

Staking.propTypes = {
  navigation: PropTypes.object.isRequired,
  wallet: PropTypes.object,
  account: PropTypes.object,
};

export default Staking;