import { ActivityIndicator, CheckBoxField, Container, Form, FormSubmitButton, FormTextField, ScrollView, Text, Toast } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import { CONSTANT_COMMONS } from '@src/constants';
import common from '@src/constants/common';
import Account from '@src/services/wallet/accountService';
import convert from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styleSheet from './style';

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
      minFee: 0,
      isDefragmenting: false,
      isGettingFee: false
    };
    this.form = null;
    this.handleShouldGetFee = _.debounce(this.handleShouldGetFee, 500);
  }

  componentDidMount = async () => {
    const { account } = this.props;
    this.updateFormValues('fromAddress', account?.PaymentAddress);
  };

  updateFormValues = (field, value) => {
    if (this.form) {
      return this.form.setFieldValue(field, value, true);
    }
  };

  goBack = () => {
    const { navigation } = this.props;
    navigation.pop();
  };

  // estimate fee when user update isPrivacy or amount, and fromAddress is not null
  handleEstimateFee = async values => {
    const { account, wallet } = this.props;
    const accountWallet = wallet.getAccountByName(account.name);

    try {
      this.setState({ isGettingFee: true });
      // const fee = await getEstimateFeeToDefragment(
      //   values.fromAddress,
      //   convert.toMiliConstant(Number(values.amount)),
      //   account.PrivateKey,
      //   accountWallet,
      //   values.isPrivacy
      // );
      const fee = 0;
      // set min fee state
      this.setState({ minFee: convert.toConstant(fee) });
      // update fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch (e) {
      Toast.showError(`Error on get estimation fee!, ${e}`);
    } finally {
      this.setState({ isGettingFee: false });
    }
  };

  handleDefragment = async values => {
    try {
      this.setState({ isDefragmenting: true });
      const { account, wallet } = this.props;
      const { amount, fee, isPrivacy, fromAddress } = values;
      try {
        const res = await Account.defragment(
          convert.toMiliConstant(Number(amount)),
          convert.toMiliConstant(Number(fee)),
          isPrivacy,
          account,
          wallet
        );

        if (res.txId) {
          openReceipt({
            txId: res.txId,
            fromAddress,
            amount: convert.toMiliConstant(Number(amount)),
            amountUnit: CONSTANT_COMMONS.CONST_SYMBOL,
            time: formatUtil.toMiliSecond(res.lockTime),
            fee: convert.toMiliConstant(Number(fee))
          });
        } else {
          Toast.showError(
            `Defragment failed. Please try again! Err: ${res.err.Message ||
              res.err}`
          );
        }
      } catch (e) {
        Toast.showError(
          `Defragment failed. Please try again! Err: ${e.message}`
        );
      }
    } catch (e) {
      Toast.showError(e.message);
    } finally {
      this.setState({ isDefragmenting: false });
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.fromAddress) {
      return;
    }

    const { amount, fromAddress, isPrivacy } = values;

    if (amount && fromAddress && typeof isPrivacy === 'boolean') {
      this.handleEstimateFee(values);
    }
  };

  onFormValidate = values => {
    const { account } = this.props;
    const errors = {};

    const { amount, fee } = values;
    const { minFee } = this.state;

    if (amount >= convert.toConstant(Number(account.value))) {
      errors.amount = `Must be less than ${convert.toConstant(
        Number(account.value)
      )} ${common.CONST_SYMBOL}`;
    }

    if (fee < minFee) {
      errors.fee = `Must be at least min fee ${minFee} ${common.CONST_SYMBOL}`;
    }

    return errors;
  };

  render() {
    const { account } = this.props;
    const { initialFormValues, isDefragmenting, isGettingFee } = this.state;
    const balance = `${formatUtil.amountConstant(account.value)} ${
      CONSTANT_COMMONS.CONST_SYMBOL
    }`;
    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Defragment</Text>
          <Text>{`Balance: ${balance}`}</Text>
          <Form
            formRef={form => (this.form = form)}
            initialValues={initialFormValues}
            onSubmit={this.handleDefragment}
            viewProps={{ style: styleSheet.form }}
            // validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField
              name="fromAddress"
              placeholder="From Address"
              editable={false}
              onFieldChange={this.handleShouldGetFee}
            />
            <CheckBoxField
              name="isPrivacy"
              label="Is Privacy"
              onFieldChange={this.handleShouldGetFee}
            />
            <FormTextField
              name="amount"
              placeholder="Amount"
              onFieldChange={this.handleShouldGetFee}
            />
            <FormTextField
              name="fee"
              placeholder="Min Fee"
              prependView={isGettingFee ? <ActivityIndicator /> : undefined}
            />
            <FormSubmitButton title="DEFRAGMENT" style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>
            * Only send CONSTANT to a CONSTANT address.
          </Text>
          <ReceiptModal />
        </Container>
        {isDefragmenting && <LoadingTx />}
      </ScrollView>
    );
  }
}

Defragment.propTypes = {
  navigation: PropTypes.objectOf(PropTypes.object).isRequired,
  account: PropTypes.objectOf(PropTypes.object),
  wallet: PropTypes.objectOf(PropTypes.object)
};

export default Defragment;
