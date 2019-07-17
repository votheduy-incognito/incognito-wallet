import React, { Component } from 'react';
import PropTypes from 'prop-types';
import memmoize from 'memoize-one';
import { View, TouchableOpacity, Text, ActivityIndicator } from '@src/components/core';
import formatUtil from '@src/utils/format';
import styles from './styles';

const LEVELS = [
  {
    name: 'LOW',
    rate: 1,
  },
  {
    name: 'MEDIUM',
    rate: 2,
  },
  {
    name: 'FAST',
    rate: 3,
  }
];

const calcFinalFee = (minFee, rate) => {
  if (minFee === 0 && rate !== 1) {
    return Number(0.05 * rate) || 0;
  }
  return Number(minFee * rate) || 0;
};

class EstimateFee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levels: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { minFee } = props;

    if (minFee !== 0 && !minFee) {
      return null;
    }
    
    const levels = LEVELS.map(level => {
      const fee = formatUtil.amount(calcFinalFee(minFee, level?.rate));
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
    const { types, minFee, isGettingFee, defaultFeeSymbol, finalFee, estimateErrorMsg } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <Text>Fee type</Text>
          {
            types?.map(type => {
              const onPress = () => this.handleSelectFeeType(type);
              return (
                <TouchableOpacity key={type} onPress={onPress} style={[defaultFeeSymbol === type && styles.feeTypeHighlight, styles.feeType]}>
                  <Text>Use {type}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
        { estimateErrorMsg
          ? <Text>{estimateErrorMsg}</Text>
          : (minFee === 0 || !!minFee) && (
            <View>
              {
                isGettingFee ?
                  <ActivityIndicator /> : 
                  levels?.map(({ fee, level }) => {
                    const onPress = () => this.handleSelectRate(fee);
                    return (
                      <TouchableOpacity key={level?.name} onPress={onPress} style={[finalFee === fee && styles.rateHighlight, styles.rate]}>
                        <Text>{level?.name}</Text>
                        <Text>{fee} {defaultFeeSymbol}</Text>
                      </TouchableOpacity>
                    );
                  })
              }
            </View>
          ) 
        }
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
};

EstimateFee.propTypes = {
  isGettingFee: PropTypes.bool,
  onChangeDefaultSymbol: PropTypes.func,
  onSelectFee: PropTypes.func,
  minFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  types: PropTypes.array,
  defaultFeeSymbol: PropTypes.string,
  finalFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  estimateErrorMsg: PropTypes.string,
};

export default EstimateFee;
