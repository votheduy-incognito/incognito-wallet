import { ActivityIndicator, Container, ScrollView, Text, Button, View, Toast } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import { Field, change, isValid, formValueSelector } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import { connect } from 'react-redux';
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
import styleSheet from './style';

const formName = 'createToken';
const selector = formValueSelector(formName);
const initialValues = {
  fee: '0.5',
  fromAddress: ''
};
const Form = createForm(formName, { initialValues });

class CreateToken extends Component {
  constructor() {
    super();

    this.state = {
      isCreatingOrSending: false,
      isGettingFee: false,
      minFeeValidator: validator.minValue(0)
    };

    this.handleShouldGetFee = _.debounce(this.handleShouldGetFee, 1000);
  }

  componentDidUpdate(prevProps) {
    const { amount: oldAmount } = prevProps;
    const { isFormValid, amount } = this.props;

    if (amount !== oldAmount && isFormValid) {
      this.handleShouldGetFee();
    }
  }

  updateFormValues = (field, value) => {
    const { rfChange } = this.props;
    if (typeof rfChange === 'function') {
      rfChange(formName, field, value);
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
      const humanFee = convert.toHumanAmount(fee, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY);
      // set min fee state
      this.setState({ minFeeValidator: validator.minValue(humanFee) });
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
      const res = await Token.createSendPrivacyCustomToken(tokenObject, convert.toOriginalAmount(Number(fee), CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY), account, wallet);

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
    const { account, isFormValid, name, symbol, amount } = this.props;
    const { PaymentAddress: paymentAddress } = account;

    if (!isFormValid || !paymentAddress){
      return;
    }

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

  renderBalance = () => {
    const { account } = this.props;

    return <Text style={styleSheet.balance}>{` Balance: ${ formatUtil.amount(account.value, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY) } ${ tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY }`}</Text>;
  }

  render() {
    const { minFeeValidator, isCreatingOrSending, isGettingFee } = this.state;

    return (
      <ScrollView>
        <Container style={styleSheet.container}>
          {this.renderBalance()}
          <Form>
            {({ handleSubmit, submitting }) => (
              <View style={styleSheet.form}>
                <Field
                  component={InputField}
                  name='name'
                  placeholder='Name'
                  label='Name'
                  style={styleSheet.input}
                  validate={[validator.required]}
                />
                <Field
                  component={InputField}
                  name='symbol'
                  placeholder='Symbol'
                  label='Symbol'
                  style={styleSheet.input}
                  validate={[validator.required]}
                />
                <Field
                  component={InputField}
                  name='amount'
                  placeholder='Amount'
                  label='Amount'
                  style={styleSheet.input}
                  validate={[...validator.combinedAmount]}
                />
                <Field
                  component={InputField}
                  name='fee'
                  placeholder='Min fee'
                  label='Min fee'
                  style={styleSheet.input}
                  validate={[validator.required, validator.number, minFeeValidator]}
                  prependView={isGettingFee ? <ActivityIndicator /> : undefined}
                />
                <Button
                  title='Create'
                  style={styleSheet.submitBtn}
                  onPress={handleSubmit(this.handleCreateSendToken)}
                  isAsync
                  isLoading={submitting}
                />
              </View>
            )}
          </Form>
        </Container>
        { isCreatingOrSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}

CreateToken.defaultProps = {
  isFormValid: false,
  name: null,
  symbol: null,
  amount: null
};

CreateToken.propTypes = {
  navigation: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  rfChange: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool,
  name: PropTypes.string,
  symbol: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const mapDispatch = {
  rfChange: change
};

const mapState = state => ({
  amount: selector(state, 'amount'),
  name: selector(state, 'name'),
  symbol: selector(state, 'symbol'),
  isFormValid: isValid(formName)(state)
});


export default connect(mapState, mapDispatch)(CreateToken);