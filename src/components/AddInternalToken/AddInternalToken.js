import { Text, Button, View, Toast } from '@src/components/core';
import LoadingTx from '@src/components/LoadingTx';
import { Field, change, isValid, formValueSelector } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withNavigation } from 'react-navigation';
import { CONSTANT_COMMONS } from '@src/constants';
import { getEstimateFeeForPToken } from '@src/services/wallet/RpcClientService';
import Token from '@src/services/wallet/tokenService';
import formatUtil from '@src/utils/format';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { setWallet } from '@src/redux/actions/wallet';
import tokenData from '@src/constants/tokenData';
import { ExHandler } from '@src/services/exception';
import styleSheet from './style';

const formName = 'addInternalToken';
const selector = formValueSelector(formName);
const initialValues = {
  fromAddress: ''
};
const Form = createForm(formName, { initialValues });

class AddInternalToken extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isCreatingOrSending: false,
      isGettingFee: false,
      fee: null,
    };

    this.handleShouldGetFee = _.debounce(this.handleShouldGetFee, 1000);
  }

  componentDidUpdate(prevProps) {
    const { amount: oldAmount, isFormValid: oldIsFormValid } = prevProps;
    const { isFormValid, amount } = this.props;

    if ((amount !== oldAmount || isFormValid !== oldIsFormValid) && isFormValid) {
      this.handleShouldGetFee();
    }
  }

  updateFormValues = (field, value) => {
    const { rfChange } = this.props;
    if (typeof rfChange === 'function') {
      rfChange(formName, field, value);
    }
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation?.popToTop();
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
      const fee =  await getEstimateFeeForPToken(fromAddress, toAddress, Number(amount), tokenObject, accountWallet);

      // update fee
      this.setState({ fee });
    } catch(e){
      new ExHandler(e).showErrorToast();
    } finally {
      this.setState({ isGettingFee: false });
    }
  };

  handleCreateSendToken = async (values) => {
    const { account, wallet, setWallet } = this.props;

    const { name, symbol, amount } = values;
    const { fee } = this.state;

    const tokenObject = {
      Privacy : true,
      TokenID: '',
      TokenName: name,
      TokenSymbol: symbol,
      TokenTxType: CONSTANT_COMMONS.TOKEN_TX_TYPE.INIT,
      TokenAmount: Number(amount),
      TokenReceivers: [{
        PaymentAddress: account?.PaymentAddress,
        Amount: Number(amount)
      }]
    };

    try {
      this.setState({ isCreatingOrSending: true });
      const res = await Token.createSendPToken(tokenObject, Number(fee) || 0, account, wallet);
      if (res.txId) {
        Toast.showSuccess('Create token successfully');

        // update new wallet to store
        setWallet(wallet);

        this.goBack();
      } else {
        throw new Error('Something went wrong. Please refresh the screen.');
      }
    } catch (e) {
      new ExHandler(e).showErrorToast();
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
    const { isCreatingOrSending, isGettingFee, fee } = this.state;
    const { account } = this.props;
    const isNotEnoughFee = account?.value < fee;
    const isCanSubmit = !isGettingFee && typeof fee === 'number' && !isNotEnoughFee;

    return (
      <View style={styleSheet.container}>
        <Form style={styleSheet.form}>
          {({ handleSubmit, submitting }) => (
            <>
              <View style={styleSheet.fields}>
                <Field
                  component={InputField}
                  name='name'
                  placeholder='Enter token name'
                  label='Name'
                  style={styleSheet.input}
                  validate={validator.combinedTokenName}
                />
                <Field
                  component={InputField}
                  componentProps={{ autoCapitalize: 'characters' }}
                  name='symbol'
                  placeholder='Enter token symbol'
                  label='Symbol'
                  style={styleSheet.input}
                  validate={validator.combinedTokenSymbol}
                />
                <Field
                  component={InputField}
                  name='amount'
                  placeholder='Enter number of tokens'
                  label='Total supply'
                  style={styleSheet.input}
                  componentProps={{
                    keyboardType: 'decimal-pad'
                  }}
                  validate={[...validator.combinedNanoAmount]}
                />
                {
                  isGettingFee
                    ? <Text>Calculating fee...</Text>
                    : typeof fee === 'number' && (
                      <Text style={isNotEnoughFee && styleSheet.error}>
                        Issuance fee: {formatUtil.amountFull(fee, CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY)} {tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY}
                        {isNotEnoughFee && ' (please top up your balance to cover the fee)' }
                      </Text>
                    )
                }
              </View>
              <Button
                disabled={!isCanSubmit}
                title={
                  isGettingFee ? 'Calculating fee...' : 'Issue'
                }
                style={styleSheet.submitBtn}
                onPress={handleSubmit(this.handleCreateSendToken)}
                isAsync
                isLoading={isGettingFee || submitting}
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
  setWallet: PropTypes.func.isRequired,
  isFormValid: PropTypes.bool,
  name: PropTypes.string,
  symbol: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const mapDispatch = {
  rfChange: change,
  setWallet
};

const mapState = state => ({
  amount: selector(state, 'amount'),
  name: selector(state, 'name'),
  symbol: selector(state, 'symbol'),
  isFormValid: isValid(formName)(state)
});


export default compose(
  connect(mapState, mapDispatch),
  withNavigation
)(AddInternalToken);
