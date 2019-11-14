import React from 'react';
import PropTypes from 'prop-types';
import { Field, formValueSelector, isValid, change } from 'redux-form';
import { connect } from 'react-redux';
import convertUtil from '@src/utils/convert';
import { Container, ScrollView, View, Button } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import LoadingTx from '@src/components/LoadingTx';
import EstimateFee from '@src/components/EstimateFee';
import CurrentBalance from '@src/components/CurrentBalance';
import { isExchangeRatePToken } from '@src/services/wallet/RpcClientService';
import { createForm, InputQRField, InputMaxValueField, validator } from '@src/components/core/reduxForm';
import { ExHandler } from '@src/services/exception';
import { CONSTANT_COMMONS } from '@src/constants';
import { homeStyle } from './style';

const formName = 'sendCrypto';
const selector = formValueSelector(formName);
const initialFormValues = {
  amount: '',
  toAddress: ''
};
const Form = createForm(formName, {
  initialValues: initialFormValues
});

class SendCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      supportedFeeTypes: [],
      maxAmountValidator: undefined,
      estimateFeeData: {},
    };
  }

  componentDidMount() {
    this.setFormValidation({ maxAmount: this.getMaxAmount() });
    this.getSupportedFeeTypes();
  }

  componentDidUpdate(prevProps, prevState) {
    const { estimateFeeData: { fee, feeUnit } } = this.state;
    const { estimateFeeData: { fee: oldFee, feeUnit: oldFeeUnit } } = prevState;
    const { receiptData } = this.props;
   
    if (fee !== oldFee || feeUnit !== oldFeeUnit) {
      // need to re-calc max amount can be send if fee was changed
      this.setFormValidation({ maxAmount: this.getMaxAmount() });
    }

    if (receiptData?.txId !== prevProps.receiptData?.txId) {
      openReceipt(receiptData);
    }
  }

  getMaxAmount = () => {
    const { selectedPrivacy } = this.props;
    const { estimateFeeData: { fee, feeUnit } } = this.state;
    let amount = selectedPrivacy?.amount;

    if (feeUnit === selectedPrivacy?.symbol) {
      amount-= fee || 0;
    }

    const maxAmount = convertUtil.toHumanAmount(amount, selectedPrivacy?.pDecimals);

    return Math.max(maxAmount, 0);
  }

  setFormValidation = ({ maxAmount }) => {
    const { selectedPrivacy } = this.props;

    this.setState({
      maxAmountValidator: validator.maxValue(maxAmount, {
        message: maxAmount > 0
          ? `Max amount you can send is ${maxAmount} ${selectedPrivacy?.symbol}`
          : 'Your balance is not enough to send'
      }),
    });
  }

  handleQrScanAddress = () => {
    openQrScanner(data => {
      this.updateFormValues('toAddress', data);
    });
  }

  updateFormValues = (field, value) => {
    const { rfChange } = this.props;
    if (typeof rfChange === 'function') {
      rfChange(formName, field, value);
    }
  }

  handleSend = async values => {
    try {
      const { handleSend } = this.props;
      const { estimateFeeData: { fee, feeUnit } } = this.state;

      if (typeof handleSend === 'function') {
        await handleSend({ ...values, fee, feeUnit });
      }
    } catch (e) {
      new ExHandler(e, 'Something went wrong. Just tap the Send button again.').showErrorToast();
    }
  }

  handleSelectFee = (estimateFeeData) => {
    this.setState({ estimateFeeData });
  }

  shouldDisabledSubmit = () => {
    const { estimateFeeData: { fee } } = this.state;
    if (fee !== 0 && !fee) {
      return true;
    }

    return false;
  }

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

  getAmountValidator = () => {
    const { selectedPrivacy } = this.props;
    const { maxAmountValidator } = this.state;

    const val = [];

    if (maxAmountValidator) val.push(maxAmountValidator);

    if (selectedPrivacy.isIncognitoToken) {
      val.push(...validator.combinedNanoAmount);
    }

    if (selectedPrivacy.isMainCrypto || selectedPrivacy.isPToken) {
      val.push(...validator.combinedAmount);
    }

    return val;
  }

  render() {
    const { supportedFeeTypes, estimateFeeData } = this.state;
    const { isSending, selectedPrivacy, amount, toAddress, isFormValid, account } = this.props;
    const types = [CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV];
    const maxAmount = this.getMaxAmount();

    if (selectedPrivacy?.symbol !== CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV) {
      types.unshift(selectedPrivacy?.symbol);
    }

    return (
      <ScrollView style={homeStyle.container}>
        <Container style={homeStyle.mainContainer}>
          <CurrentBalance />
          <Form>
            {({ handleSubmit }) => (
              <View style={homeStyle.form}>
                <Field
                  component={InputQRField}
                  name='toAddress'
                  label='To'
                  placeholder='Enter wallet address'
                  style={homeStyle.input}
                  validate={validator.combinedIncognitoAddress}
                />
                <Field
                  component={InputMaxValueField}
                  name='amount'
                  placeholder='0.0'
                  label='Amount'
                  style={homeStyle.input}
                  maxValue={maxAmount}
                  componentProps={{
                    keyboardType: 'decimal-pad'
                  }}
                  validate={this.getAmountValidator()}
                />
                <EstimateFee
                  accountName={account?.name}
                  estimateFeeData={estimateFeeData}
                  onNewFeeData={this.handleSelectFee}
                  types={supportedFeeTypes}
                  amount={isFormValid ? amount : null}
                  toAddress={isFormValid ? toAddress : null}
                />
                <Button title='Send' style={homeStyle.submitBtn} disabled={this.shouldDisabledSubmit()} onPress={handleSubmit(this.handleSend)} />
              </View>
            )}
          </Form>
          <ReceiptModal />
        </Container>
        { isSending && <LoadingTx /> }
      </ScrollView>
    );
  }
}

SendCrypto.defaultProps = {
  receiptData: null,
  isSending: false,
  isFormValid: false,
  amount: null,
  toAddress: null,
};

SendCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  receiptData: PropTypes.object,
  handleSend: PropTypes.func.isRequired,
  rfChange: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  isFormValid: PropTypes.bool,
  amount: PropTypes.string,
  toAddress: PropTypes.string,
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
)(SendCrypto);
