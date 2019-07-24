import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector, isValid, change } from 'redux-form';
import { Container, ScrollView, Toast, Text, View, TouchableOpacity, Button } from '@src/components/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import EstimateFee from '@src/components/EstimateFee';
import convertUtil from '@src/utils/convert';
import { getErrorMessage, messageCode } from '@src/services/errorHandler';
import { openQrScanner } from '@src/components/QrCodeScanner';
import LoadingTx from '@src/components/LoadingTx';
import tokenData from '@src/constants/tokenData';
import formatUtil from '@src/utils/format';
import style from './style';
import { homeStyle } from '../Home.old/style';

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
      maxAmount: null,
      finalFee: null,
      feeUnit: null,
    };
  }

  componentDidMount() {
    const { withdrawData, selectedPrivacy } = this.props;
    const maxAmount = convertUtil.toHumanAmount(withdrawData?.maxWithdrawAmount, selectedPrivacy?.symbol);

    this.setMaxAmount(maxAmount);
  }

  setMaxAmount = (maxAmount) => {
    this.setState({
      maxAmount,
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

  handleSubmit = async values => {
    try {
      const { finalFee, feeUnit } = this.state;
      const { handleGenAddress, handleSendToken, navigation } = this.props;
      const { amount, toAddress } = values;
      const tempAddress = await handleGenAddress({ amount, paymentAddress: toAddress });
      const res = await handleSendToken({ tempAddress, amount, fee: finalFee, feeUnit });
      
      Toast.showInfo('Withdraw successfully');
      navigation.goBack();
      return res;
    } catch (e) {
      Toast.showError(getErrorMessage(e, { defaultCode: messageCode.code.withdraw_failed }));
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

  render() {
    const { maxAmountValidator, maxAmount, finalFee, feeUnit, initialFee } = this.state;
    const { selectedPrivacy, isFormValid, amount } = this.props;
    const types = [selectedPrivacy?.symbol, tokenData.SYMBOL.MAIN_CRYPTO_CURRENCY];

    return (
      <ScrollView style={style.container}>
        <Container style={style.mainContainer}>
          <View style={style.currentBalanceContainer}>
            <Text style={style.currentBalance}>{formatUtil.amount(maxAmount)} {selectedPrivacy?.symbol}</Text>
            <Text style={style.currentBalanceLabel}>Current Balance</Text>
          </View>
          <Form style={homeStyle.form}>
            {({ handleSubmit, submitting }) => (
              <>
                <Field
                  component={InputField}
                  name='toAddress'
                  placeholder='To Address'
                  prependView={(
                    <TouchableOpacity onPress={this.handleQrScanAddress}>
                      <MaterialCommunityIcons name='qrcode-scan' size={20} />
                    </TouchableOpacity>
                  )}
                  validate={[validator.required]}
                />
                <Field
                  component={InputField}
                  name='amount'
                  placeholder='Amount'
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
                <Text style={style.feeText}>Fee: {formatUtil.amount(finalFee, feeUnit)} {feeUnit}</Text>
                <Button title='WITHDRAW' style={style.submitBtn} disabled={this.shouldDisabledSubmit()} onPress={handleSubmit(this.handleSubmit)} isAsync isLoading={submitting} />
                {submitting && <LoadingTx />}
              </>
            )}
          </Form>
        </Container>
      </ScrollView>
    );
  }
}

Withdraw.propTypes = {
  withdrawData: PropTypes.object.isRequired,
  handleGenAddress: PropTypes.func.isRequired,
  handleSendToken: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
  selectedPrivacy: PropTypes.object.isRequired,
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
