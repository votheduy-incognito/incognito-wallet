import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Text, Container, Form, FormTextField, FormSubmitButton, Toast, ScrollView, TouchableOpacity, ActivityIndicator } from '@src/components/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FONT } from '@src/styles';
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
import { openQrScanner } from '@src/components/QrCodeScanner';
import LoadingTx from '@src/components/LoadingTx';

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
      balanceToken: 0,
      isCreatingOrSending: false,
      isGettingFee: false
    };

    this.handleShouldGetFee = _.debounce(::this.handleShouldGetFee, 500);

    this.form = null;
  }

  componentDidMount() {
    const { account, isCreate, token } = this.props;

    let toAddress = '';
    let name = '';
    let symbol = '';

    if (isCreate){
      toAddress = account?.PaymentAddress;
    } else {
      name = token.Name;
      symbol = token.Symbol;
    }
    
    this.setFormValue({
      ...initialFormValues,
      fromAddress: account?.PaymentAddress,
      toAddress,
      name, 
      symbol,
    });

    this.reloadBalanceToken();
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
    const { account, wallet, isPrivacy, isCreate, token } = this.props;

    const { fromAddress, toAddress, name, symbol, amount } = values;
    
    const type = isCreate ? CONSTANT_COMMONS.INIT_TOKEN : CONSTANT_COMMONS.SEND_TOKEN;

    const tokenAmount = isCreate ? amount : token.Amount;

    const tokenObject = {
      Privacy : isPrivacy,
      TokenID:  token?.ID || '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: type,
      TokenAmount: Number(tokenAmount),
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: Number(amount)
      }
    };

    const accountWallet = wallet.getAccountByName(account.name);
    try{
      this.setState({ isGettingFee: true });
      const fee =  await getEstimateFeeForSendingToken(fromAddress, toAddress, Number(amount), tokenObject, account.PrivateKey, accountWallet);
      // set min fee state
      this.setState({minFee: convert.toConstant(fee)});
      // update fee
      this.updateFormValues('fee', String(convert.toConstant(fee)));
    } catch(e){
      Toast.showError(`Error on get estimation fee! ${e}`);
    } finally {
      this.setState({ isGettingFee: false });
    }
  };

  handleCreateSendToken = async (values) => {
    const { account, wallet, isPrivacy, isCreate, reloadListFollowToken, token, reloadBalanceToken } = this.props;

    const { toAddress, name, symbol, amount, fee } = values;

    const type = isCreate ? CONSTANT_COMMONS.INIT_TOKEN : CONSTANT_COMMONS.SEND_TOKEN;

    const text = isCreate ? 'Create' : 'Send';
    const tokenAmount = isCreate ? amount : token.Amount;

    const tokenObject = {
      Privacy : isPrivacy,
      TokenID: token?.ID || '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: type,
      TokenAmount: Number(tokenAmount),
      TokenReceivers: {
        PaymentAddress: toAddress,
        Amount: Number(amount)
      }
    };

    try {
      this.setState({ isCreatingOrSending: true });
      let res;
      if (!isPrivacy){
        res = await Token.createSendCustomToken(tokenObject, convert.toMiliConstant(Number(fee)), account, wallet);
      } else{
        res = await Token.createSendPrivacyCustomToken(tokenObject, convert.toMiliConstant(Number(fee)), account, wallet);
      }

      if (res.txId) {
        Toast.showInfo(`${text} token successfully`);
        if (isCreate){
          reloadListFollowToken();
        } else{
          setTimeout(() => reloadBalanceToken(), 10000);
        }
      } else {
        Toast.showError(`${text} token failed. Please try again! Err: ${res.err.Message || res.err }`);
      }
    } catch (e) {
      Toast.showError(`${text} token failed. Please try again! Err:' ${e.message}`);
    } finally {
      this.setState({ isCreatingOrSending: false });
    }
  };

  handleShouldGetFee = async () => {
    const { errors, values } = this.form;

    if (errors?.amount || errors?.toAddress || errors?.name || errors?.symbol){
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

  shouldReloadBalanceToken = () =>{
    const { isCreate } = this.props;
    return !isCreate;
  }

  reloadBalanceToken = async () => {
    if (this.shouldReloadBalanceToken()) {
      const {account, wallet, token}  = this.props;
      const accountWallet = wallet.getAccountByName(account.name);

      if (token.IsPrivacy) {
        this.setState({ balanceToken: await accountWallet.getPrivacyCustomTokenBalance(token.ID) });
      } else{
        this.setState({ balanceToken: await accountWallet.getCustomTokenBalance(token.ID) });
      }
    }
  };

  renderBalance = () => {
    const { account, isCreate, token } = this.props;

    if (isCreate){
      return <Text> Balance: { formatUtil.amountConstant(account.value) } { CONSTANT_COMMONS.CONST_SYMBOL }</Text>;
    }

    return <Text> Balance: { formatUtil.amountToken(this.state.balanceToken) } { token.Name }</Text>;
  }

  handleQrScanAddress = () => {
    openQrScanner(data => {
      this.updateFormValues('toAddress', data);
    });
  }

  render() {
    const {  isCreate } = this.props;
    const { initialFormValues, isCreatingOrSending, isGettingFee } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          <Text style={styleSheet.title}>{isCreate?'Create':'Send'} Token</Text>
          {this.renderBalance()}
          <Form
            formRef={form => this.form = form}
            initialValues={initialFormValues}
            onSubmit={this.handleCreateSendToken}
            viewProps={{ style: styleSheet.form }}
            validationSchema={formValidate}
            validate={this.onFormValidate}
          >
            <FormTextField name='fromAddress' placeholder='From Address' editable={false}  />
            <FormTextField name='toAddress' placeholder='To Address' 
              prependView={
                <TouchableOpacity onPress={this.handleQrScanAddress}>
                  <MaterialCommunityIcons name='qrcode-scan' size={FONT.SIZE.large} />
                </TouchableOpacity>
              }
            />
            <FormTextField name='name' placeholder='Name' />
            <FormTextField name='symbol' placeholder='Symbol' />
            <FormTextField name='amount' placeholder='Amount' onFieldChange={this.handleShouldGetFee}/>
            <FormTextField name='fee' placeholder='Min Fee' prependView={isGettingFee ? <ActivityIndicator /> : undefined} />
            <FormSubmitButton title={isCreate?'CREATE':'SEND'} style={styleSheet.submitBtn} />
          </Form>
          <Text style={styleSheet.noteText}>* Only send CONSTANT to a CONSTANT address.</Text>
          <ReceiptModal />
        </Container>
        { isCreatingOrSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}

CreateSendToken.propTypes = {
  navigation: PropTypes.object,
  wallet: PropTypes.object,
  account: PropTypes.object,
  isPrivacy: PropTypes.bool,
  isCreate: PropTypes.bool,
  reloadListFollowToken: PropTypes.func,
  token: PropTypes.object,
  reloadBalanceToken: PropTypes.func
};

export default CreateSendToken;