import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from '@src/components/core';
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
class EstimateFee extends Component {
  constructor() {
    super();

    this.state = {
      currentRate: 'LOW',
    };
  }

  calcFinalFee = (minFee, rate) => Number(minFee * rate) || 0;

  handleSelectRate = level => {
    const { name, rate } = level;
    const { onSelectFee, fee } = this.props;
    const finalFee = this.calcFinalFee(fee, rate);

    this.setState({ currentRate: name });

    if (typeof onSelectFee === 'function') {
      onSelectFee(finalFee);
    }
  }

  render() {
    const { currentRate } = this.state;
    const { feeUnit, fee } = this.props;

    return (
      <View style={styles.container}>
        {
          LEVELS.map(level => {
            const onPress = () => this.handleSelectRate(level);
            return (
              <TouchableOpacity key={level?.name} onPress={onPress} style={[currentRate === level?.name && styles.highlight, styles.rate]}>
                <Text>{level?.name}</Text>
                <Text>{formatUtil.amount(this.calcFinalFee(fee, level?.rate), feeUnit)} {feeUnit}</Text>
              </TouchableOpacity>
            );
          })
        }
      </View>
    );
  }
}

EstimateFee.propTypes = {
  onSelectFee: PropTypes.func.isRequired,
  fee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  feeUnit: PropTypes.string.isRequired,
};

export default EstimateFee;
