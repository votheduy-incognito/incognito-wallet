import React from 'react';
import PropTypes from 'prop-types';
import { Field, formValueSelector, isValid, change } from 'redux-form';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import convertUtil from '@src/utils/convert';
import { Container, ScrollView, TouchableOpacity, Button, Text, View, Toast } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import ReceiptModal, { openReceipt } from '@src/components/Receipt';
import LoadingTx from '@src/components/LoadingTx';
import EstimateFee from '@src/components/EstimateFee';
import CurrentBalance from '@src/components/CurrentBalance';
import tokenData from '@src/constants/tokenData';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import formatUtil from '@src/utils/format';
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
      feeUnit: null,
      finalFee: null,
      maxAmountValidator: undefined,
    };
  }

  componentDidMount() {
    const { selectedPrivacy } = this.props;
    const maxAmount = convertUtil.toHumanAmount(selectedPrivacy?.amount, selectedPrivacy?.pDecimals);

    this.setFormValidation({ maxAmount });
  }

  componentDidUpdate(prevProps) {
    const { receiptData } = this.props;

    if (receiptData?.txId !== prevProps.receiptData?.txId) {
      openReceipt(receiptData);
    }
  }

  setFormValidation = ({ maxAmount }) => {
    this.setState({
      maxAmountValidator: validator.maxValue(maxAmount),
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
      const { finalFee, feeUnit } = this.state;
      const { handleSend } = this.props;

      if (typeof handleSend === 'function') {
        await handleSend({ ...values, fee: finalFee, feeUnit });
      }
    } catch (e) {
      Toast.showError(e.message);
    }
  }

  handleSelectFee = ({ fee, feeUnit }) => {
    this.setState({ finalFee: fee, feeUnit });
  }

  shouldDisabledSubmit = () => {
    const { finalFee } = this.state;
    if (finalFee !== 0 && !finalFee) {
      return true;
    }

    return false;
  }

  render() {
    const { finalFee, feeUnit, maxAmountValidator } = this.state;
    const { isSending, selectedPrivacy, amount, toAddress, isFormValid } = this.props;
    const types = [tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];

    if (selectedPrivacy?.symbol !== tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY) {
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
                  component={InputField}
                  name='toAddress'
                  placeholder='To Address'
                  prependView={(
                    <TouchableOpacity onPress={this.handleQrScanAddress}>
                      <MaterialCommunityIcons name='qrcode-scan' size={20} />
                    </TouchableOpacity>
                  )}
                  style={homeStyle.input}
                  validate={validator.combinedPaymentAddress}
                />
                <Field
                  component={InputField}
                  name='amount'
                  placeholder='Amount'
                  style={homeStyle.input}
                  validate={[
                    ...validator.combinedAmount,
                    ...maxAmountValidator ? [maxAmountValidator] : []
                  ]}
                />
                <EstimateFee
                  initialFee={0}
                  finalFee={finalFee}
                  onSelectFee={this.handleSelectFee}
                  types={types}
                  amount={isFormValid ? amount : null}
                  toAddress={isFormValid ? toAddress : null}
                />
                <Text style={homeStyle.feeText}>
                  Fee: {formatUtil.amount(
                    finalFee,
                    feeUnit === tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY ? CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY : selectedPrivacy?.pDecimals
                  )} {feeUnit}
                </Text>
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

SendCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired
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
