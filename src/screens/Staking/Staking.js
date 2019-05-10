import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, PickerField, Picker } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import styleSheet from './style';
import Account from '@src/services/wallet/accountService';
import { getStakingAmount, getEstimateFee } from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import _ from 'lodash';
import formValidate from './formValidate';

const initialValues = {
  stakingType: CONSTANT_COMMONS.STAKING_TYPES.SHARD,
  toAddress: CONSTANT_COMMONS.STAKING_ADDRESS,
  fromAddress: '',
  amount: '',
  fee: String(CONSTANT_COMMONS.STAKING_MIN_FEE)
};

class Staking extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues: initialValues
    };

    this.form = null;
    this.handleEstimateFee = _.debounce(::this.handleEstimateFee, 500);
  }

  componentDidMount = async () => {
    const { account } = this.props;
    this.updateFormValues('fromAddress', account?.PaymentAddress);
    await this.handleLoadAmountStaking(initialValues.stakingType);
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
  handleLoadAmountStaking = async (stakingType) => {
    try{
      const amount = await getStakingAmount(Number(stakingType));
      this.updateFormValues('amount', String(convert.toConstant(amount)));
    } catch(e){
      Toast.showError('Get amount staking failed!' +  e);
    }
  }

  // Todo: call this function when user change stakingType
  handleEstimateFee = async (values) => {
    const { account, wallet } = this.props;

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      const fee =  await getEstimateFee(values.fromAddress, values.toAddress, values.amount, account.PrivateKey, accountWallet, false);
      // update min fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch(e){
      // alert(JSON.stringify(e.stack));
      Toast.showError('Error on get estimation fee!');
    }
  };
  
  shouldGetFee = async ({values, errors}) => {
    if (Object.values(errors).length) {
      return;
    } 

    const { toAddress, amount, stakingType } = values;

    if (toAddress && amount && stakingType !== undefined) {
      await this.handleEstimateFee(values);
    }
  }

  shouldLoadAmountStaking = async ({prevStakingType, stakingType, errors}) => {
    if (Object.values(errors).length) {
      return;
    } 

    if (prevStakingType !== stakingType){
      await this.handleLoadAmountStaking(stakingType);
    }
  }

  handleFormChange = async (prevState, state) => {
    await this.shouldLoadAmountStaking({ prevStakingType: prevState?.values?.stakingType, stakingType: state?.values?.stakingType, errors : state?.errors});
    await this.shouldGetFee({ values: state?.values, errors : state?.errors });
  }

  handleStaking = async (values) => {
    const { account, wallet } = this.props;

    const param = { type: Number(values.stakingType), burningAddress: CONSTANT_COMMONS.STAKING_ADDRESS };

    try {
      const res = await Account.staking(param, values.fee, account, wallet);

      if (res.txId) {
        Toast.showInfo('Staking successfully. TxId: ', res.txId);
        this.goHome();
      } else {
        Toast.showError('Staking failed. Please try again! Err:' + res.err.Message || res.err);
      }
    } catch (e) {
      Toast.showError('Staking failed. Please try again! Err:' + e.message);
    }
  };

  //Todo: validate inputs
  onFormValidate = values => {
    // const { account } = this.props;
    const errors = {};

    console.log(values);

    // if (values.amount >= account.value) {
    //   errors.amount = `Must be less than ${values?.amount}`;
    // }
    
    return errors;
  }

  render() {
    const { account } = this.props;
    const { initialFormValues } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Staking</Text>
          <Text>
            Balance: { formatUtil.amountConstant(account.value) } {CONSTANT_COMMONS.CONST_SYMBOL}
          </Text>
          <Form 
            formRef={form => this.form = form} 
            initialValues={initialFormValues} 
            onSubmit={this.handleStaking} 
            viewProps={{ style: styleSheet.form }} 
            validationSchema={formValidate}
            onFormChange={this.handleFormChange}
            validate={this.onFormValidate}
          >
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