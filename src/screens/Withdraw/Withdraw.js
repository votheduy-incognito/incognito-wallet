import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, formValueSelector, isValid, change } from 'redux-form';
import { Container, ScrollView, Toast, Text, TouchableOpacity, Button } from '@src/components/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import EstimateFee from '@src/components/EstimateFee';
import convertUtil from '@src/utils/convert';
import { getErrorMessage, messageCode } from '@src/services/errorHandler';
import tokenData from '@src/constants/tokenData';
import formatUtil from '@src/utils/format';
import style from './style';

const formName = 'withdraw';
const selector = formValueSelector(formName);
const initialFormValues = {
  amount: '',
  toAddress: '0xd5808Ba261c91d640a2D4149E8cdb3fD4512efe4'
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

  handleSubmit = async values => {
    try {
      const { finalFee } = this.state;
      const { handleGenAddress, handleSendToken, navigation } = this.props;
      const { amount, toAddress } = values;
      const tempAddress = await handleGenAddress({ amount, paymentAddress: toAddress });
      const res = await handleSendToken({ tempAddress, amount, fee: finalFee });
      
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
          <Text>Balance: {formatUtil.amount(selectedPrivacy?.amount, selectedPrivacy?.symbol)} {selectedPrivacy?.symbol}</Text>
          <Text>Max balance can withdraw: {formatUtil.amount(maxAmount)} {selectedPrivacy?.symbol}</Text>
          <Form>
            {({ handleSubmit }) => (
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
                <Button title='SEND' style={style.submitBtn} disabled={this.shouldDisabledSubmit()} onPress={handleSubmit(this.handleSubmit)} />
              </>
            )}
          </Form>
          <Text>Fee: {formatUtil.amount(finalFee, feeUnit)} {feeUnit}</Text>
        </Container>
      </ScrollView>
    );
  }
}

Withdraw.propTypes = {
  withdrawData: PropTypes.object.isRequired,
  handleEstimateFeeToken: PropTypes.func.isRequired,
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
