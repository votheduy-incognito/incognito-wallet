import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { createForm, InputField, validator } from '@src/components/core/reduxForm';
import { View, TouchableOpacity, Text, ActivityIndicator, Button } from '@src/components/core';
import convert from '@src/utils/convert';
import styles from './styles';


const getAnotherTypeOfFee = (types, feeUnitByTokenId) => {
  
  return types?.find(t => t?.tokenId !== feeUnitByTokenId);
};

const feeValidator = [
  validator.required(),
  validator.number(),
  validator.largerThan(0)
];

const formName = 'changeFee';
const Form = createForm(formName, {
  destroyOnUnmount: false
});

class EstimateFee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRetrying: false,
      anotherFee: null,
      isShowChangeFeeInput: false,
      minFeeValidator: null
    };
  }

  static getDerivedStateFromProps(nextProps) {
    let state = {};

    const { estimateErrorMsg, types, estimateFeeData, feePDecimals, minFee } = nextProps;
    const { feeUnitByTokenId, feeUnit } = estimateFeeData;

    if (estimateErrorMsg) {
      const another = getAnotherTypeOfFee(types, feeUnitByTokenId);
      state.anotherFee = another;
    } else {
      state.anotherFee = null;
    }

    if (minFee) {
      const convertedMinFee = convert.toHumanAmount(minFee, feePDecimals);
      const convertedMinFeeStr = convertedMinFee.toFixed(feePDecimals);
      state.minFeeValidator = validator.minValue(convertedMinFee, { message: `Must be at least ${convertedMinFeeStr} ${feeUnit}` });
    }

    return state;
  }

  componentWillUnmount() {
    // destroy change fee form
    const { rfDestroy } = this.props;
    rfDestroy(formName);
  }

  handleChangeFee = () => {
    this.setState({ isShowChangeFeeInput: true }, () => {
      const { rfChange, estimateFeeData, feePDecimals } = this.props;
      const convertedFee = convert.toHumanAmount(estimateFeeData?.fee, feePDecimals);

      if (typeof convertedFee === 'number') {
        rfChange(formName, 'fee', convertedFee.toFixed(feePDecimals));
      }
    });
  };

  onChangeNewFee = (values) => {
    const { onNewFeeData, feePDecimals, setUserFee } = this.props;
    const { fee } = values;

    // convert fee to nano fee
    const originalFee = convert.toOriginalAmount(fee, feePDecimals);

    if (typeof onNewFeeData === 'function' && typeof originalFee === 'number') {
      this.setState({ isShowChangeFeeInput: false });
      onNewFeeData({ fee: originalFee });
      setUserFee(originalFee);
    }
  }
  
  handleSelectFeeType = (type) => {
    const { onNewFeeData } = this.props;
    if (typeof onNewFeeData === 'function') {
      onNewFeeData({ feeUnitByTokenId: type?.tokenId, feeUnit: type?.symbol });
    }
  }
  
  onRetry = (anotherFee) => {
    if (anotherFee) {
      this.handleSelectFeeType(anotherFee);
      return;
    }

    const { onRetry } = this.props;
    const delay = new Promise(r => {
      setTimeout(() => r(), 500);
    });
    this.setState({ isRetrying: true });
    Promise.all([onRetry(), delay])
      .finally(() => {
        this.setState({ isRetrying: false });
      });
  }

  renderChangeFee = () => {
    const { minFeeValidator } = this.state;
    return (
      <Form style={styles.changeFeeForm}>
        {({ handleSubmit }) => (
          <>
            <Text style={styles.feeTextTitle}>The more you pay, the faster you get</Text>
            <Field
              component={InputField}
              componentProps={{
                keyboardType: 'decimal-pad'
              }}
              name='fee'
              placeholder='Enter new fee'
              style={styles.changeFeeInput}
              validate={[
                ...feeValidator,
                ...minFeeValidator ? [minFeeValidator] : []
              ]}
            />
            <Button titleStyle={styles.changeFeeSubmitText} style={styles.changeFeeSubmitBtn} title='Use this fee' onPress={handleSubmit(this.onChangeNewFee)} />
          </>
        )}
      </Form>
    );
  }

  render() {
    const { isRetrying, anotherFee, isShowChangeFeeInput } = this.state;
    const { types, isGettingFee, estimateErrorMsg, style, feeText, estimateFeeData } = this.props;
    const { feeUnitByTokenId, fee } = estimateFeeData || {};

    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>Select fee & speed</Text>
        <View style={styles.box}>
          <View>
            <View style={styles.feeTypeGroup}>
              {
                types?.map((type, index) => {
                  const { symbol, tokenId } = type;
                  const onPress = () => this.handleSelectFeeType(type);
                  const isHighlight = feeUnitByTokenId === tokenId;
                  return (
                    <TouchableOpacity
                      key={tokenId}
                      onPress={onPress}
                      style={
                        [
                          styles.feeType,
                          index === 0 && styles.feeTypeFirst,
                          isHighlight && styles.feeTypeHighlight
                        ]
                      }
                    >
                      <Text
                        style={
                          [
                            styles.feeTypeText,
                            isHighlight && styles.feeTypeTextHighlight
                          ]
                        }
                      >
                        Use {symbol}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              }
            </View>
          </View>
          
          { estimateErrorMsg
            ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{estimateErrorMsg}</Text>
                <Button onPress={() => this.onRetry(anotherFee)} style={styles.retryBtn} title={anotherFee ? `Try ${anotherFee?.symbol}` : 'Try again'} isAsync isLoading={isRetrying} />
              </View>
            )
            : (
              <View style={styles.rateContainer}>
                {
                  fee === null || fee === undefined && !isGettingFee
                    ? <Text style={styles.rateText}>Transaction fee will be calculated here</Text>
                    : (
                      isGettingFee ?
                        <ActivityIndicator /> : 
                        (
                          isShowChangeFeeInput
                            ? this.renderChangeFee()
                            : (
                              <View style={styles.feeTextContainer}>
                                <Text style={styles.feeTextTitle}>{'You\'ll pay'}</Text>
                                <Text>{feeText}</Text>
                                <TouchableOpacity style={styles.changeFeeBtn} onPress={this.handleChangeFee}>
                                  <Text style={styles.changeFeeText}>Change the fee</Text>
                                </TouchableOpacity>
                              </View>
                            )
                        )
                    )
                }
              </View>
            ) 
          }
        </View>
      </View>
    );
  }
}

EstimateFee.defaultProps = {
  isGettingFee: false,
  types: [],
  estimateErrorMsg: null,
  onRetry: null,
  style: null,
  feeText: null,
  feePDecimals: null
};

EstimateFee.propTypes = {
  isGettingFee: PropTypes.bool,
  onRetry: PropTypes.func,
  onNewFeeData: PropTypes.func.isRequired,
  rfChange: PropTypes.func.isRequired,
  rfDestroy: PropTypes.func.isRequired,
  setUserFee: PropTypes.func.isRequired,
  feePDecimals: PropTypes.number,
  types: PropTypes.array,
  estimateFeeData: PropTypes.object.isRequired,
  feeText: PropTypes.string,
  estimateErrorMsg: PropTypes.string,
  style: PropTypes.object,
};

export default EstimateFee;
