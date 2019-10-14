import { Button, Container, ScrollView, Text, Toast, View } from '@src/components/core';
import { createForm, InputMaxValueField, InputQRField, validator } from '@src/components/core/reduxForm';
import CurrentBalance from '@src/components/CurrentBalance';
import EstimateFee from '@src/components/EstimateFee';
import LoadingTx from '@src/components/LoadingTx';
import { CONSTANT_COMMONS } from '@src/constants';
import tokenData from '@src/constants/tokenData';
import { ExHandler } from '@src/services/exception';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import memmoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { change, Field, formValueSelector, isValid } from 'redux-form';
import style from './style';

const formName = 'withdraw';
const selector = formValueSelector(formName);
const initialFormValues = {
  amount: '',
  toAddress: ''
};

const Form = createForm(formName, {
  initialValues: initialFormValues
});


class Withdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialFee: props?.withdrawData?.feeCreateTx,
      maxAmountValidator: undefined,
      finalFee: null,
      feeUnit: null,
    };
  }

  componentDidMount() {
    this.setFormValidator({ maxAmount: this.getMaxAmount() });
  }

  
  componentDidUpdate(prevProps, prevState) {
    const { finalFee: oldFinalFee, feeUnit: oldFeeUnit } = prevState;
    const { finalFee, feeUnit } = this.state;

    if (finalFee !== oldFinalFee || feeUnit !== oldFeeUnit) {
      // need to re-calc max amount can be send if fee was changed
      this.setFormValidator({ maxAmount: this.getMaxAmount() });
    }
  }

  getMaxAmount = () => {
    const { selectedPrivacy, withdrawData } = this.props;
    const { finalFee, feeUnit } = this.state;
    let amount = withdrawData?.maxWithdrawAmount;

    if (feeUnit === selectedPrivacy?.symbol) {
      amount-= finalFee;
    }
    
    const maxAmount = convertUtil.toHumanAmount(amount, selectedPrivacy?.pDecimals);

    return Math.max(maxAmount, 0);
  }

  setFormValidator = ({ maxAmount }) => {
    const { selectedPrivacy } = this.props;

    this.setState({
      maxAmountValidator: validator.maxValue(maxAmount, {
        message: maxAmount > 0 
          ? `Max amount you can withdraw is ${maxAmount} ${selectedPrivacy?.symbol}`
          : 'Your balance is zero'
      }),
    });
  }

  handleSubmit = async values => {
    try {
      let res;
      const { finalFee, feeUnit } = this.state;
      const {  handleCentralizedWithdraw, handleDecentralizedWithdraw, navigation, selectedPrivacy } = this.props;
      const { amount, toAddress } = values;

      if (selectedPrivacy?.isDecentralized) {
        res = await handleDecentralizedWithdraw({
          amount,
          remoteAddress: toAddress,
          fee: finalFee,
          feeUnit
        });
      } else {
        res = await handleCentralizedWithdraw({
          amount,
          paymentAddress: toAddress,
          fee: finalFee,
          feeUnit
        });
      }

      if (res) {
        Toast.showSuccess('Success! You withdrew funds.');
        navigation.goBack();
        return res;
      }

      throw new Error('Withdraw failed');
    } catch (e) {
      new ExHandler(e, 'Something went wrong. Please try again.').showErrorToast();
    }
  }

  shouldDisabledSubmit = () => {
    const { finalFee } = this.state;
    if (finalFee !== 0 && !finalFee) {
      return true;
    }

    return false;
  }

  handleSelectFee = ({ fee, feeUnit }) => {
    this.setState({ finalFee: fee, feeUnit });
  }

  getAddressValidator = memmoize((symbol, isErc20Token) => {
    if (isErc20Token || symbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
      return validator.combinedETHAddress;
    } else if (symbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BTC) {
      return validator.combinedBTCAddress;
    } else if (symbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BNB) {
      return validator.combinedBNBAddress;
    }

    // default
    return validator.combinedIncognitoAddress;
  });

  render() {
    const { maxAmountValidator, finalFee, feeUnit, initialFee } = this.state;
    const { selectedPrivacy, isFormValid, amount, withdrawData } = this.props;
    const types = [selectedPrivacy?.symbol, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];
    const isUsedTokenFee = !(feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY);
    const addressValidator = this.getAddressValidator(selectedPrivacy?.externalSymbol, selectedPrivacy?.isErc20Token);
    const maxAmount = this.getMaxAmount();

    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          <View style={style.currentBalanceContainer}>
            <CurrentBalance amount={formatUtil.amount(withdrawData?.maxWithdrawAmount, selectedPrivacy?.pDecimals)} symbol={selectedPrivacy?.symbol} />
          </View>
          <Form style={style.form}>
            {({ handleSubmit, submitting }) => (
              <>
                <Field
                  component={InputQRField}
                  name='toAddress'
                  label='To'
                  placeholder='Enter wallet address'
                  style={style.input}
                  validate={addressValidator}
                />
                <Field
                  component={InputMaxValueField}
                  name='amount'
                  placeholder='Amount'
                  style={style.input}
                  maxValue={maxAmount}
                  componentProps={{
                    keyboardType: 'decimal-pad'
                  }}
                  validate={[
                    ...validator.combinedAmount,
                    ...maxAmountValidator ? [maxAmountValidator] : []
                  ]}
                />
                <EstimateFee
                  initialFee={initialFee}
                  finalFee={finalFee}
                  onSelectFee={this.handleSelectFee}
                  types={types}
                  amount={isFormValid ? amount : null}
                  toAddress={isFormValid ? selectedPrivacy?.paymentAddress : null} // est fee on the same network, dont care which address will be send to
                />
                <Text style={style.feeText}>
                  You&apos;ll pay: {formatUtil.amountFull(
                    finalFee,
                    feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : selectedPrivacy?.pDecimals
                  )} {feeUnit ? feeUnit : ''}
                  {
                    isUsedTokenFee && withdrawData?.feeForBurn
                      ? ` + (${
                        formatUtil.amount(
                          withdrawData?.feeForBurn,
                          feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : selectedPrivacy?.pDecimals
                        )
                      } ${feeUnit ? feeUnit : ''})`
                      : ''
                  }
                </Text>
                <Button title='Withdraw' style={style.submitBtn} disabled={this.shouldDisabledSubmit()} onPress={handleSubmit(this.handleSubmit)} isAsync isLoading={submitting} />
                {submitting && <LoadingTx />}
              </>
            )}
          </Form>
        </Container>
      </ScrollView>
    );
  }
}

Withdraw.defaultProps = {
  amount: null,
  isFormValid: false,
};

Withdraw.propTypes = {
  withdrawData: PropTypes.object.isRequired,
  handleCentralizedWithdraw: PropTypes.func.isRequired,
  handleDecentralizedWithdraw: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
  isFormValid: PropTypes.bool,
  amount: PropTypes.string,
};

const mapState = state => ({
  amount: selector(state, 'amount'),
  toAddress: selector(state, 'toAddress'),
  isFormValid: isValid(formName)(state)
});

const mapDispatch = {
  rfChange: change
};

export default connect(
  mapState,
  mapDispatch
)(Withdraw);
