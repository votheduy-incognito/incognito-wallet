import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, Toast, ActivityIndicator } from '@src/components/core';
import formatUtil from '@src/utils/format';
import convertUtil from '@src/utils/convert';
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

const calcFinalFee = (minFee, rate, currentFeeType) => {
  if (minFee === 0 && rate !== 1) {
    return Number(convertUtil.toOriginalAmount(0.1, currentFeeType) * rate) || 0;
  }
  return Number(minFee * rate) || 0;
};

class EstimateFee extends Component {
  constructor(props) {
    super(props);

    this.state = {
      levels: null,
      isEstimating: false,
      finalFee: null,
      currentRate: null,
      currentFeeType: props?.types[0],
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { minFee } = props;
    const { currentFeeType } = state;

    if (minFee !== 0 && !minFee) {
      return state;
    }
    
    const levels = LEVELS.map(level => {
      const fee = formatUtil.amount(calcFinalFee(minFee, level?.rate, currentFeeType), currentFeeType);
      return {
        level, fee,
      };
    });

    return {
      ...state,
      levels,
    };
  }

  componentDidMount() {
    const { onRef, } = this.props;

    if (typeof onRef === 'function') {
      onRef(this);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { onSelectFee, minFee } = this.props; 
    const { currentFeeType: oldFeeType, finalFee: oldFinalFee } = prevState;
    const { currentRate, currentFeeType, finalFee, levels, isEstimating } = this.state;

    if (minFee !== 0 && !minFee) {
      return;
    }

    if (oldFeeType !== currentFeeType || oldFinalFee !== finalFee) {
      if (typeof onSelectFee === 'function') {
        onSelectFee({ fee: finalFee, feeUnit: currentFeeType });
      }
    }

    if (!currentRate && !isEstimating) {
      const defaultLevel = levels[1]; // MEDIUM rate
      !!defaultLevel && this.handleSelectRate(defaultLevel?.level, defaultLevel?.fee);
    }
  }

  handleSelectFeeType = (type) => {
    this.setState({ currentFeeType: type }, () => {
      this.estimateFee();
    });
  }

  handleSelectRate = (level, fee) => {
    const { name } = level;
    this.setState({ currentRate: name, finalFee: fee });
  }

  estimateFee = async () => {
    try {
      this.setState({ isEstimating: true, currentRate: null, finalFee: null });
      const { onEstimateFee } = this.props;
      if (typeof onEstimateFee === 'function') {
        const { currentFeeType } = this.state;
        await onEstimateFee(currentFeeType);
      }
    } catch {
      Toast.showError('Can not get tracsaction fee, please try again');
    } finally {
      this.setState({ isEstimating: false });
    }
  }

  render() {
    const { currentRate, currentFeeType, isEstimating, levels } = this.state;
    const { types, minFee } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <Text>Fee type</Text>
          {
            types?.map(type => {
              const onPress = () => this.handleSelectFeeType(type);
              return (
                <TouchableOpacity key={type} onPress={onPress} style={[currentFeeType === type && styles.feeTypeHighlight, styles.feeType]}>
                  <Text>Use {type}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
        {
          (minFee === 0 || !!minFee) && (
            <View>
              {
                isEstimating ?
                  <ActivityIndicator /> : 
                  levels?.map(({ fee, level }) => {
                    const onPress = () => this.handleSelectRate(level, fee);
                    return (
                      <TouchableOpacity key={level?.name} onPress={onPress} style={[currentRate === level?.name && styles.rateHighlight, styles.rate]}>
                        <Text>{level?.name}</Text>
                        <Text>{fee} {currentFeeType}</Text>
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

EstimateFee.propTypes = {
  onSelectFee: PropTypes.func.isRequired,
  minFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  types: PropTypes.array.isRequired,
};

export default EstimateFee;
