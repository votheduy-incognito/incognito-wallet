import { ActivityIndicator, ScrollView, Text, Button, View, Toast } from '@src/components/core';
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

const formName = 'addInternalToken';
const selector = formValueSelector(formName);
const initialValues = {
  fee: '',
  fromAddress: ''
};
const Form = createForm(formName, { initialValues });
const isRequired = validator.required();
const isNumber = validator.number({ message: 'Decimals must be a number' });
const minFee = fee => validator.minValue(fee, { message: `Fee must be larger than ${fee}` });
const maxFee = balance => validator.maxValue(balance, { message: balance > 0
  ? `Fee must be less than your balance (your balance is ${balance} ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV})`
  : `Please top up your balance to cover the fee (approx 0.001 ${CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV}).` });

class AddInternalToken extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreatingOrSending: false,
      isGettingFee: false,
      minFeeValidator: minFee(0),
      maxFeeValidator: maxFee(convert.toHumanAmount(props?.account?.value, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY)),
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
      this.setState({ minFeeValidator: minFee(humanFee) });
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
    const { minFeeValidator, maxFeeValidator, isCreatingOrSending, isGettingFee } = this.state;
    const { account } = this.props;

    return (
      <View style={styleSheet.container}>
        <Form style={styleSheet.form}>
          {({ handleSubmit, submitting }) => (
            <>
              <ScrollView style={styleSheet.fields}>
                <Field
                  component={InputField}
                  name='name'
                  placeholder='Name'
                  label='Name'
                  style={styleSheet.input}
                  validate={[isRequired]}
                />
                <Field
                  component={InputField}
                  name='symbol'
                  placeholder='Symbol'
                  label='Symbol'
                  style={styleSheet.input}
                  validate={[isRequired]}
                />
                <Field
                  component={InputField}
                  name='amount'
                  placeholder='Amount'
                  label='Amount'
                  style={styleSheet.input}
                  componentProps={{
                    keyboardType: 'number-pad'
                  }}
                  validate={[...validator.combinedAmount]}
                />
                <Field
                  component={InputField}
                  name='fee'
                  placeholder='Issuance fee'
                  label={`Issuance fee (${tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY})`}
                  style={styleSheet.input}
                  validate={[isRequired, isNumber, minFeeValidator, maxFeeValidator]}
                  componentProps={{
                    keyboardType: 'number-pad'
                  }}
                  prependView={isGettingFee ? <ActivityIndicator /> : undefined}
                />
              </ScrollView>
              <Button
                title='Issue'
                style={styleSheet.submitBtn}
                onPress={handleSubmit(this.handleCreateSendToken)}
                isAsync
                isLoading={submitting}
              />
            </>
          )}
        </Form>
        { isCreatingOrSending && <LoadingTx /> }
      </View>
    );
  }
}

AddInternalToken.defaultProps = {
  isFormValid: false,
  name: null,
  symbol: null,
  amount: null
};

AddInternalToken.propTypes = {
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


export default connect(mapState, mapDispatch)(AddInternalToken);