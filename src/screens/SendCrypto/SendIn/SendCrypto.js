import React from 'react';
import PropTypes from 'prop-types';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Field, formValueSelector, isValid, change, focus } from 'redux-form';
import { connect } from 'react-redux';
import formatUtil from '@utils/format';
import { Toast } from '@components/core';
import ReceiptModal, { openReceipt } from '@components/Receipt';
import LoadingTx from '@components/LoadingTx';
import {
  createForm,
  InputQRField,
  InputField,
  InputMaxValueField,
  validator,
} from '@components/core/reduxForm';
import { ExHandler } from '@services/exception';
import { MESSAGES } from '@screens/Dex/constants';
import { setSelectedPrivacy } from '@src/redux/actions/selectedPrivacy';
import { generateTestId } from '@utils/misc';
import { SEND } from '@src/constants/elements';
import { ButtonBasic } from '@src/components/Button';
import EstimateFee, {
  formName as formEstimateFee,
} from '@components/EstimateFee/EstimateFee.input';
import {
  estimateFeeSelector,
  maxAmountSelector,
  minAmountSelector,
  feeDataSelector,
} from '@src/components/EstimateFee/EstimateFee.selector';
import { homeStyle } from './style';

export const formName = 'sendCrypto';

const selector = formValueSelector(formName);

const initialFormValues = {
  amount: '',
  toAddress: '',
};
const Form = createForm(formName, {
  initialValues: initialFormValues,
});

const descriptionMaxBytes = validator.maxBytes(500, {
  message: 'The description is too long',
});

class SendCrypto extends React.Component {
  constructor() {
    super();
    this.state = {
      maxAmountValidator: undefined,
      minAmountValidator: undefined,
    };
  }

  componentDidMount() {
    this.setFormValidation();
  }

  componentDidUpdate(prevProps) {
    const { selectedPrivacy, receiptData } = this.props;
    const { selectedPrivacy: oldSelectedPrivacy } = prevProps;
    const {
      feeData: { fee, feeUnitByTokenId },
    } = this.props;
    const {
      feeData: { fee: oldFee, feeUnitByTokenId: oldFeeUnitByTokenId },
    } = prevProps;

    if (
      selectedPrivacy?.tokenId !== oldSelectedPrivacy?.tokenId ||
      fee !== oldFee ||
      feeUnitByTokenId !== oldFeeUnitByTokenId
    ) {
      // need to re-calc min amount if token decimals was changed
      this.setFormValidation();
    }

    if (receiptData?.txId !== prevProps.receiptData?.txId) {
      openReceipt(receiptData);
    }
  }

  setFormValidation = () => {
    const { selectedPrivacy, minAmount, maxAmount } = this.props;
    console.log(minAmount, maxAmount);
    if (Number.isFinite(maxAmount)) {
      this.setState({
        maxAmountValidator: validator.maxValue(maxAmount, {
          message:
            maxAmount > 0
              ? `Max amount you can send is ${formatUtil.number(
                maxAmount,
              )} ${selectedPrivacy?.externalSymbol ||
                  selectedPrivacy?.symbol}`
              : 'Your balance is not enough to send',
        }),
      });
    }
    if (Number.isFinite(minAmount)) {
      this.setState({
        minAmountValidator: validator.minValue(minAmount, {
          message: `Amount must be larger than ${formatUtil.number(
            minAmount,
          )} ${selectedPrivacy?.externalSymbol || selectedPrivacy?.symbol}`,
        }),
      });
    }
  };

  handleSend = async values => {
    const { handleSend, feeData } = this.props;
    const disabledForm = this.shouldDisabledSubmit();
    if (disabledForm) {
      return;
    }
    try {
      if (typeof handleSend === 'function') {
        await handleSend({ ...values, ...feeData });
      }
    } catch (e) {
      if (e.message === MESSAGES.NOT_ENOUGH_NETWORK_FEE) {
        Toast.showError(e.message);
      } else {
        new ExHandler(
          e,
          'Something went wrong. Just tap the Send button again.',
        ).showErrorToast(true);
      }
    }
  };

  shouldDisabledSubmit = () => {
    const { isFormValid, estimateFee, isFormEstimateFeeValid } = this.props;
    const { fee } = estimateFee;
    if (!isFormValid || !fee || !isFormEstimateFeeValid) {
      return true;
    }
    return false;
  };

  getAmountValidator = () => {
    const { selectedPrivacy } = this.props;
    const { maxAmountValidator, minAmountValidator } = this.state;
    const val = [];
    if (minAmountValidator) val.push(minAmountValidator);
    if (maxAmountValidator) val.push(maxAmountValidator);
    if (selectedPrivacy.isIncognitoToken) {
      val.push(...validator.combinedNanoAmount);
    }
    if (selectedPrivacy.isMainCrypto || selectedPrivacy.isPToken) {
      val.push(...validator.combinedAmount);
    }
    const values = Array.isArray(val) ? [...val] : [val];
    return values;
  };

  handleSelectToken = tokenId => {
    const { setSelectedPrivacy } = this.props;
    setSelectedPrivacy(tokenId);
  };
  // When click into Max button, auto set to max value with substract fee
  // It should be refactored into a utils, not prefer this here.
  reReduceMaxAmount = amount => {
    // Holding on next stage
    const { rfChange } = this.props;
    rfChange(formName, 'amount', `${amount}`);
  };

  render() {
    const {
      isSending,
      amount,
      toAddress,
      isFormValid,
      onShowFrequentReceivers,
      reloading,
      maxAmount,
    } = this.props;
    return (
      <ScrollView
        contentContainerStyle={homeStyle.scrollview}
        refreshControl={<RefreshControl refreshing={reloading} />}
      >
        <View style={homeStyle.mainContainer}>
          <Form>
            {({ handleSubmit }) => (
              <View style={homeStyle.form}>
                <Field
                  component={InputMaxValueField}
                  name="amount"
                  placeholder="0.0"
                  label="Amount"
                  style={homeStyle.input}
                  maxValue={maxAmount}
                  componentProps={{
                    keyboardType: 'decimal-pad',
                  }}
                  validate={this.getAmountValidator()}
                  {...generateTestId(SEND.AMOUNT_INPUT)}
                />
                <Field
                  component={InputQRField}
                  name="toAddress"
                  label="To"
                  placeholder="Name, Address"
                  style={homeStyle.input}
                  validate={validator.combinedIncognitoAddress}
                  showNavAddrBook
                  onOpenAddressBook={onShowFrequentReceivers}
                  {...generateTestId(SEND.ADDRESS_INPUT)}
                />
                <EstimateFee
                  style={homeStyle.input}
                  amount={isFormValid ? amount : null}
                  address={isFormValid ? toAddress : null}
                  isFormValid={isFormValid}
                />
                <Field
                  component={InputField}
                  inputStyle={homeStyle.input}
                  containerStyle={homeStyle.input}
                  componentProps={{ multiline: true, numberOfLines: 10 }}
                  name="message"
                  placeholder="Add a note (optional)"
                  label="Memo"
                  maxLength={500}
                  style={[
                    homeStyle.input,
                    {
                      marginBottom: 0,
                    },
                  ]}
                  validate={descriptionMaxBytes}
                  {...generateTestId(SEND.MEMO_INPUT)}
                />
                <ButtonBasic
                  title="Send"
                  btnStyle={homeStyle.submitBtn}
                  disabled={this.shouldDisabledSubmit()}
                  onPress={handleSubmit(this.handleSend)}
                  {...generateTestId(SEND.SUBMIT_BUTTON)}
                />
              </View>
            )}
          </Form>
          <ReceiptModal />
        </View>
        {isSending && <LoadingTx />}
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
  selectable: true,
  reloading: false,
};

SendCrypto.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  account: PropTypes.object.isRequired,
  receiptData: PropTypes.object,
  handleSend: PropTypes.func.isRequired,
  setSelectedPrivacy: PropTypes.func.isRequired,
  isSending: PropTypes.bool,
  isFormValid: PropTypes.bool,
  amount: PropTypes.string,
  toAddress: PropTypes.string,
  selectable: PropTypes.bool,
  onShowFrequentReceivers: PropTypes.func.isRequired,
  reloading: PropTypes.bool,
  Balance: PropTypes.func.isRequired,
  estimateFee: PropTypes.any.isRequired,
  maxAmount: PropTypes.number.isRequired,
  minAmount: PropTypes.number.isRequired,
  feeData: PropTypes.any.isRequired,
  isFormEstimateFeeValid: PropTypes.bool.isRequired,
};

const mapState = state => ({
  amount: selector(state, 'amount'),
  toAddress: selector(state, 'toAddress'),
  isFormValid: isValid(formName)(state),
  estimateFee: estimateFeeSelector(state),
  maxAmount: maxAmountSelector(state),
  minAmount: minAmountSelector(state),
  feeData: feeDataSelector(state),
  isFormEstimateFeeValid: isValid(formEstimateFee)(state),
});

const mapDispatch = {
  setSelectedPrivacy,
  rfChange: change,
  rfFocus: focus,
};

export default connect(
  mapState,
  mapDispatch,
)(SendCrypto);
