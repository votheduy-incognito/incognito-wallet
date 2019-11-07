import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { View, TouchableOpacity, Text, ActivityIndicator, Button, Toast } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
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
    const expectedMin = pDecimals ? (10 ** pDecimals * 0.0001) : 1;
    return Number(expectedMin * rate) || 0;
  }
  return Number(minFee * rate) || 0;
});

class EstimateFee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levels: null,
      isRetrying: false,
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
    const { minFee, finalFee, defaultFeeSymbol } = this.props;
    const { levels } = this.state;

    if (oldDefaultFeeSymbol === defaultFeeSymbol && this.shouldSetDefaultRate(levels, minFee, finalFee)) {
      const selectDefaultLevel = (level) => {
        const defaultLevel = level;
        defaultLevel && this.handleSelectRate(defaultLevel.fee);
      };
      if (this.isAvailabelFee(levels[1].fee, defaultFeeSymbol)) {
        selectDefaultLevel(levels[1]);
      } else if (this.isAvailabelFee(levels[0].fee, defaultFeeSymbol)) {
        selectDefaultLevel(levels[0]);
      }
    }
  }

  shouldSetDefaultRate = memmoize((levels, minFee, finalFee) => {
    try {
      if (minFee === null) return false;

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

  isAvailabelFee = (fee, symbol) => {
    const { account, selectedPrivacy } = this.props;
    let amount = 0;

    if (symbol === selectedPrivacy?.symbol) {
      amount = selectedPrivacy?.amount;
    } else if (symbol === CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV) {
      amount = account?.value;
    }

    if (amount >= fee) {
      return true;
    }

    return false;
  }

  onRetry = () => {
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

  handleSelectUnavailableFee = (fee) => {
    const { defaultFeeSymbol, feeDecimals } = this.props;
    const formatedFee = formatUtil.amountFull(fee, feeDecimals);
    Toast.showWarning(`Your balance is not enough to pay ${formatedFee} ${defaultFeeSymbol} fee.`);
  }

  render() {
    const { levels, isRetrying } = this.state;
    const { types, minFee, isGettingFee, defaultFeeSymbol, estimateErrorMsg, finalFee, style } = this.props;

    return (
      <View style={[styles.container, style]}>
        <Text style={styles.label}>Select fee & speed</Text>
        <View style={styles.box}>
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
          
          { estimateErrorMsg
            ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{estimateErrorMsg}</Text>
                <Button onPress={this.onRetry} style={styles.retryBtn} title='Try again' isAsync isLoading={isRetrying} />
              </View>
            )
            : (
              <View style={styles.rateContainer}>
                {
                  !minFee && !isGettingFee
                    ? <Text style={styles.rateText}>Transaction fee will be calculated here</Text>
                    : (
                      isGettingFee ?
                        <ActivityIndicator /> : 
                        levels?.map(({ fee, level }) => {
                          const isAvailabelFee = this.isAvailabelFee(fee, defaultFeeSymbol);
                          const onPress = isAvailabelFee ? () => this.handleSelectRate(fee) : this.handleSelectUnavailableFee.bind(null, fee);
                          return (
                            <TouchableOpacity key={level?.name} onPress={onPress} style={styles.rate}>
                              <Text style={[styles.rateText, finalFee === fee && styles.rateTextHighlight, !isAvailabelFee && { textDecorationLine: 'line-through' }]}>{level?.name}</Text>
                              {/* <Text>{formatUtil.amount(fee, defaultFeeSymbol)} {defaultFeeSymbol}</Text> */}
                            </TouchableOpacity>
                          );
                        })
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
  onChangeDefaultSymbol: null,
  onSelectFee: null,
  types: [],
  defaultFeeSymbol: null,
  finalFee: null,
  estimateErrorMsg: null,
  onRetry: null,
  style: null,
  account: null,
  selectedPrivacy: null,
  feeDecimals: null
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
  account: PropTypes.object,
  selectedPrivacy: PropTypes.object,
  feeDecimals: PropTypes.number,
};

export default EstimateFee;
