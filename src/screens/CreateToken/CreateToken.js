import { ActivityIndicator, Container, Form, FormSubmitButton, FormTextField, ScrollView, Text, Toast } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';
import ROUTE_NAMES from '@src/router/routeNames';
import { getEstimateFeeForSendingTokenService } from '@src/services/wallet/RpcClientService';
import Token from '@src/services/wallet/tokenService';
import convert from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import tokenData from '@src/constants/tokenData';

import formValidate from './formValidate';
import styleSheet from './style';


const initialFormValues = {
  fee: '0.5',
  fromAddress: ''
};

class CreateToken extends Component {
  constructor() {
    super();

    this.state = {
      initialFormValues,
      minFee: 0,
      isCreatingOrSending: false,
      isGettingFee: false
    };

    this.handleShouldGetFee = _.debounce(this.handleShouldGetFee, 1000);

    this.form = null;
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

    const { fromAddress, toAddress, name, symbol, amount } = values;

    const tokenObject = {
      Privacy : true,
      TokenID: '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.INIT,
      TokenAmount: Number(amount),
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: Number(amount)
      }
    };

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      this.setState({ isGettingFee: true });
      const fee =  await getEstimateFeeForSendingTokenService(fromAddress, toAddress, Number(amount), tokenObject, account.PrivateKey, accountWallet);
      const humanFee = convert.toHumanAmount(fee, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY);
      // set min fee state
      this.setState({minFee: humanFee});
      // update fee
      this.updateFormValues('fee', String(humanFee));
    } catch(e){
      Toast.showError(`Error on get estimation fee! ${e}`);
    } finally {
      this.setState({ isGettingFee: false });
    }
  };

  handleCreateSendToken = async (values) => {
    const { account, wallet } = this.props;

    const { name, symbol, amount, fee } = values;

    const tokenObject = {
      Privacy : true,
      TokenID: '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.INIT,
      TokenAmount: Number(amount),
      TokenReceivers: {
        PaymentAddress: account?.PaymentAddress,
        Amount: Number(amount)
      }
    };

    try {
      this.setState({ isCreatingOrSending: true });
      const res = await Token.createSendPrivacyCustomToken(tokenObject, convert.toOriginalAmount(Number(fee), tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY), account, wallet);

      if (res.txId) {
        Toast.showInfo('Create token successfully');

      } else {
        Toast.showError(`Create token failed. Please try again! Err: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      Toast.showError(`Create token failed. Please try again! Err:' ${e.message}`);
    } finally {
      this.setState({ isCreatingOrSending: false });
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;
    const { account } = this.props;
    const { PaymentAddress: paymentAddress } = account;

    if (errors?.amount || errors?.name || errors?.symbol || !paymentAddress){
      return;
    }

    const { name, symbol, amount } = values;

    if (amount && paymentAddress && name && symbol){
      this.handleEstimateFee({
        name,
        symbol,
        amount, 
        toAddress: paymentAddress,
        fromAddress: paymentAddress
      });
    }
  }

  onFormValidate = values => {
    const errors = {};

    const { fee } = values;
    const { minFee } = this.state;


    if (fee < minFee){
      errors.fee = `Must be at least min fee ${minFee} ${tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY}`;
    } 
    
    return errors;
  }


  renderBalance = () => {
    const { account } = this.props;

    return <Text>{` Balance: ${ formatUtil.amount(account.value, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY) } ${ tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY }`}</Text>;
  }

  render() {
    const { initialFormValues, isCreatingOrSending, isGettingFee } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>Create Token</Text>
          {this.renderBalance()}
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleCreateSendToken}
            viewProps={{ style: styleSheet.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='name' placeholder='Name' />
            <FormTextField name='symbol' placeholder='Symbol' />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee}/>
            <FormTextField name='fee' placeholder='Min Fee' prependView={isGettingFee ? <ActivityIndicator /> : undefined} />
            <FormSubmitButton title='CREATE' style={styleSheet.submitBtn} />
          </Form>
        </Container>
        { isCreatingOrSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}

CreateToken.propTypes = {
  navigation:  PropTypes.objectOf(PropTypes.object),
  wallet:  PropTypes.objectOf(PropTypes.object),
  account:  PropTypes.objectOf(PropTypes.object),
};

export default CreateToken;