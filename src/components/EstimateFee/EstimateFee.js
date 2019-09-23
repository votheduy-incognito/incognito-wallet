import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { View, TouchableOpacity, Text, ActivityIndicator } from '@src/components/core';
import styles from './styles';

const LEVELS = [
  {
    name: 'Normal',
    rate: 1,
  },
  {
    name: 'Faster',
    rate: 2,
  },
  {
    name: 'Swift',
    rate: 3,
  }
];

const calcFinalFee = memmoize((minFee, rate, pDecimals) => {
  if (minFee === 0 && rate !== 1) {
    const expectedMin = pDecimals ? (10 ** pDecimals * 0.001) : 1;
    return Number(expectedMin * rate) || 0;
  }
  return Number(minFee * rate) || 0;
});

class EstimateFee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levels: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { minFee, selectedPrivacy } = props;

    if (minFee !== 0 && !minFee) {
      return null;
    }
    
    const levels = LEVELS.map(level => {
      const fee = calcFinalFee(minFee, level?.rate, selectedPrivacy?.pDecimals);
      return {
        level, fee,
      };
    });

    return {
      ...state,
      levels,
    };
  }

  componentDidUpdate(prevProps) {
    const { defaultFeeSymbol: oldDefaultFeeSymbol } = prevProps;
    const { finalFee, defaultFeeSymbol } = this.props;
    const { levels } = this.state;

    if (oldDefaultFeeSymbol === defaultFeeSymbol && this.shouldSetDefaultRate(levels, finalFee)) {
      const defaultLevel = levels[1];
      defaultLevel && this.handleSelectRate(defaultLevel.fee);
    }
  }

  shouldSetDefaultRate = memmoize((levels, finalFee) => {
    try {
      const found = levels.find(level => level.fee === finalFee);
      if (!found) return true;
      return false;
    } catch {
      return false;
    }
  })

  handleSelectFeeType = (type) => {
    const { onChangeDefaultSymbol, onSelectFee } = this.props;
    onChangeDefaultSymbol(type);
    if (typeof onSelectFee === 'function') {
      onSelectFee({ fee: null, feeUnit: type });
    }
  }

  handleSelectRate = (fee) => {
    const { onSelectFee, defaultFeeSymbol } = this.props;
    if (typeof onSelectFee === 'function') {
      onSelectFee({ fee, feeUnit: defaultFeeSymbol });
    }
  }

  render() {
    const { levels } = this.state;
    const { types, minFee, isGettingFee, defaultFeeSymbol, finalFee, estimateErrorMsg, onRetry, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>Select fee & speed</Text>
        <View style={styles.box}>
          {
            !estimateErrorMsg && (
              <View>
                <View style={styles.feeTypeGroup}>
                  {
                    types?.map((type, index) => {
                      const onPress = () => this.handleSelectFeeType(type);
                      const isHighlight = defaultFeeSymbol === type;
                      return (
                        <TouchableOpacity
                          key={type}
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
                            Use {type}
                          </Text>
                        </TouchableOpacity>
                      );
                    })
                  }
                </View>
              </View>
            )
          }
          
          { estimateErrorMsg
            ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{estimateErrorMsg}</Text>
                <TouchableOpacity onPress={onRetry} style={styles.retryBtn}><Text style={styles.retryText}>Try again</Text></TouchableOpacity>
              </View>
            )
            : (minFee === 0 || !!minFee) && (
              <View style={styles.rateContainer}>
                {
                  isGettingFee ?
                    <ActivityIndicator /> : 
                    levels?.map(({ fee, level }) => {
                      const onPress = () => this.handleSelectRate(fee);
                      return (
                        <TouchableOpacity key={level?.name} onPress={onPress} style={styles.rate}>
                          <Text style={[styles.rateText, finalFee === fee && styles.rateTextHighlight]}>{level?.name}</Text>
                          {/* <Text>{formatUtil.amount(fee, defaultFeeSymbol)} {defaultFeeSymbol}</Text> */}
                        </TouchableOpacity>
                      );
                    })
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
  onChangeDefaultSymbol: null,
  onSelectFee: null,
  types: [],
  defaultFeeSymbol: null,
  finalFee: null,
  estimateErrorMsg: null,
  onRetry: null,
  style: null
};

EstimateFee.propTypes = {
  isGettingFee: PropTypes.bool,
  onRetry: PropTypes.func,
  onChangeDefaultSymbol: PropTypes.func,
  onSelectFee: PropTypes.func,
  minFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  types: PropTypes.array,
  defaultFeeSymbol: PropTypes.string,
  finalFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  estimateErrorMsg: PropTypes.string,
  style: PropTypes.object,
};

export default EstimateFee;
