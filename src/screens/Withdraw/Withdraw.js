import { Button, Container, ScrollView, Toast, Text, View } from '@src/components/core';
import { createForm, InputMaxValueField, InputQRField, validator } from '@src/components/core/reduxForm';
import CurrentBalance from '@src/components/CurrentBalance';
import EstimateFee from '@src/components/EstimateFee';
import LoadingTx from '@src/components/LoadingTx';
import {CONSTANT_COMMONS, CONSTANT_EVENTS} from '@src/constants';
import { ExHandler } from '@src/services/exception';
import convertUtil from '@src/utils/convert';
import formatUtil from '@src/utils/format';
import memmoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';
import { isExchangeRatePToken } from '@src/services/wallet/RpcClientService';
import { connect } from 'react-redux';
import { detectToken } from '@src/utils/misc';
import { change, Field, formValueSelector, isValid } from 'redux-form';
import {logEvent} from '@services/firebase';
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

const memoMaxLength = validator.maxLength(125, {
  message: 'The memo is too long'
});

class Withdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maxAmountValidator: undefined,
      minAmountValidator: undefined,
      estimateFeeData: {},
      supportedFeeTypes: [],
      feeForBurn: 0
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { estimateFeeData: { fee, feeUnitByTokenId } } = prevState;

    return {
      feeForBurn: fee,
      isUsedPRVFee: feeUnitByTokenId === CONSTANT_COMMONS.PRV_TOKEN_ID
    };
  }

  componentDidMount() {
    this.setFormValidator({ maxAmount: this.getMaxAmount(), minAmount: this.getMinAmount() });
    this.getSupportedFeeTypes();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedPrivacy } = this.props;
    const { selectedPrivacy: oldSelectedPrivacy } = prevProps;
    const { estimateFeeData: { fee, feeUnitByTokenId } } = this.state;
    const { estimateFeeData: { fee: oldFee, feeUnitByTokenId: oldFeeUnitByTokenId } } = prevState;

    if (selectedPrivacy?.pDecimals !== oldSelectedPrivacy?.pDecimals) {
      // need to re-calc min amount if token decimals was changed
      this.setFormValidator({ minAmount: this.getMinAmount() });
    }

    if (fee !== oldFee || feeUnitByTokenId !== oldFeeUnitByTokenId) {
      // need to re-calc max amount can be send if fee was changed
      this.setFormValidator({ maxAmount: this.getMaxAmount() });
    }
  }

  getMinAmount = () => {
    // MIN = 1 nano
    const { selectedPrivacy, minAmount } = this.props;
    let min = 0;
    if (selectedPrivacy?.pDecimals) {
      min = 1/(10**selectedPrivacy.pDecimals);
    }

    return minAmount ? Math.max(min, minAmount) : min;
  }

  getMaxAmount = () => {
    const { selectedPrivacy, maxAmount } = this.props;
    const { estimateFeeData: { fee }, feeForBurn, isUsedPRVFee } = this.state;
    let max = 0;
    let amount = selectedPrivacy?.amount;

    if (!isUsedPRVFee) {
      amount-= (fee + feeForBurn) || 0;
    }

    max = convertUtil.toHumanAmount(amount, selectedPrivacy?.pDecimals);

    return maxAmount ? Math.min(maxAmount, max) : max;
  }

  setFormValidator = ({ maxAmount, minAmount }) => {
    const { selectedPrivacy } = this.props;

    if (maxAmount) {
      this.setState({
        maxAmountValidator: validator.maxValue(maxAmount, {
          message: maxAmount > 0
            ? `Max amount you can withdraw is ${formatUtil.number(maxAmount)} ${selectedPrivacy?.symbol}`
            : 'Your balance is not enough to withdraw'
        }),
      });
    }

    if (minAmount) {
      this.setState({
        minAmountValidator: validator.minValue(minAmount, {
          message: `Amount must be larger than ${formatUtil.number(minAmount)} ${selectedPrivacy?.symbol}`
        }),
      });
    }
  }

  handleSubmit = async values => {
    const { selectedPrivacy } = this.props;
    try {
      let res;
      const { estimateFeeData: { fee }, isUsedPRVFee, feeForBurn } = this.state;
      const {  handleCentralizedWithdraw, handleDecentralizedWithdraw, navigation } = this.props;
      const { amount, toAddress, memo } = values;
      const convertedAmount = convertUtil.toNumber(amount);

      await logEvent(CONSTANT_EVENTS.WITHDRAW, {
        tokenId: selectedPrivacy?.tokenId,
        tokenSymbol: selectedPrivacy?.symbol,
      });
      if (selectedPrivacy?.isDecentralized) {
        res = await handleDecentralizedWithdraw({
          amount: convertedAmount,
          remoteAddress: toAddress,
          fee,
          isUsedPRVFee,
          feeForBurn
        });
      } else {
        res = await handleCentralizedWithdraw({
          amount: convertedAmount,
          remoteAddress: toAddress,
          fee,
          isUsedPRVFee,
          feeForBurn,
          memo
        });
      }

      if (res) {
        Toast.showSuccess('Success! You withdrew funds.');

        await logEvent(CONSTANT_EVENTS.WITHDRAW_SUCCESS, {
          tokenId: selectedPrivacy?.tokenId,
          tokenSymbol: selectedPrivacy?.symbol,
        });

        navigation.goBack();
        return res;
      }

      throw new Error('Withdraw failed');
    } catch (e) {
      await logEvent(CONSTANT_EVENTS.WITHDRAW, {
        tokenId: selectedPrivacy?.tokenId,
        tokenSymbol: selectedPrivacy?.symbol,
      });

      new ExHandler(e, 'Something went wrong. Please try again.').showErrorToast(true);
    }
  }

  shouldDisabledSubmit = () => {
    const { estimateFeeData: { fee } } = this.state;
    if (fee !== 0 && !fee) {
      return true;
    }

    return false;
  }

  handleSelectFee = (estimateFeeData) => {
    this.setState({ estimateFeeData });
  }

  getAddressValidator = memmoize((externalSymbol, isErc20Token) => {
    if (isErc20Token || externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.ETH) {
      return validator.combinedETHAddress;
    } if (externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.TOMO) {
      return validator.combinedTOMOAddress;
    } else if (externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BTC) {
      return validator.combinedBTCAddress;
    } else if (externalSymbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.BNB) {
      return validator.combinedBNBAddress;
    }

    // default
    return validator.combinedUnknownAddress;
  });

  getSupportedFeeTypes = async () => {
    const supportedFeeTypes = [{
      tokenId: CONSTANT_COMMONS.PRV_TOKEN_ID,
      symbol: CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV
    }];

    try {
      const { selectedPrivacy } = this.props;
      const isUsed = await isExchangeRatePToken(selectedPrivacy.tokenId);
      isUsed && supportedFeeTypes.push({
        tokenId: selectedPrivacy.tokenId,
        symbol: selectedPrivacy.symbol
      });
    } catch (e) {
      new ExHandler(e);
    } finally {
      this.setState({ supportedFeeTypes });
    }
  }

  render() {
    const { maxAmountValidator, minAmountValidator, supportedFeeTypes, estimateFeeData, feeForBurn, isUsedPRVFee } = this.state;
    const { fee, feeUnit } = estimateFeeData;
    const { selectedPrivacy, isFormValid, amount, account } = this.props;
    const { externalSymbol, isErc20Token, name: tokenName } = selectedPrivacy || {};
    const addressValidator = this.getAddressValidator(externalSymbol, isErc20Token);
    const maxAmount = this.getMaxAmount();


    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          <View style={style.currentBalanceContainer}>
            <CurrentBalance />
          </View>
          <Form style={style.form}>
            {({ handleSubmit, submitting }) => (
              <>
                <Field
                  component={InputQRField}
                  name='toAddress'
                  label='To'
                  placeholder={`Enter your ${tokenName}  address`}
                  style={style.input}
                  validate={addressValidator}
                />
                <Field
                  component={InputMaxValueField}
                  name='amount'
                  label='Amount'
                  placeholder='Amount'
                  style={style.input}
                  maxValue={maxAmount}
                  componentProps={{
                    keyboardType: 'decimal-pad'
                  }}
                  validate={[
                    ...validator.combinedAmount,
                    ...maxAmountValidator ? [maxAmountValidator] : [],
                    ...minAmountValidator ? [minAmountValidator] : []
                  ]}
                />
                {
                  detectToken.ispBNB(selectedPrivacy?.tokenId) && (
                    <View style={style.memoContainer}>
                      <Field
                        component={InputQRField}
                        name='memo'
                        label='Memo (ontional)'
                        placeholder='Enter a memo (max 125 characters)'
                        style={style.input}
                        validate={memoMaxLength}
                      />
                      <Text style={style.memoText}>* For withdrawals to wallets on exchanges (e.g. Binance, etc.), enter your memo to avoid loss of funds.</Text>
                    </View>
                  )
                }
                <EstimateFee
                  accountName={account?.name}
                  estimateFeeData={estimateFeeData}
                  onNewFeeData={this.handleSelectFee}
                  types={supportedFeeTypes}
                  amount={isFormValid ? amount : null}
                  toAddress={isFormValid ? selectedPrivacy?.paymentAddress : null} // est fee on the same network, dont care which address will be send to
                  feeText={(
                    <View>
                      {
                        fee && (
                          <Text style={style.feeText}>
                            Transaction fee:
                            {' '}
                            {formatUtil.amountFull(fee, isUsedPRVFee ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : selectedPrivacy?.pDecimals)}
                            {' '}
                            {feeUnit ? feeUnit : ''}
                          </Text>
                        )
                      }
                      {
                        feeForBurn && (
                          <Text style={style.feeText}>
                            Withdraw fee:
                            {' '}
                            {formatUtil.amountFull(feeForBurn, isUsedPRVFee ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : selectedPrivacy?.pDecimals)}
                            {' '}
                            {feeUnit ? feeUnit : ''}
                          </Text>
                        )
                      }

                    </View>
                  )}
                />
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
  minAmount: null,
  maxAmount: null
};

Withdraw.propTypes = {
  handleCentralizedWithdraw: PropTypes.func.isRequired,
  handleDecentralizedWithdraw: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  isFormValid: PropTypes.bool,
  amount: PropTypes.string,
  minAmount: PropTypes.number,
  maxAmount: PropTypes.number
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
