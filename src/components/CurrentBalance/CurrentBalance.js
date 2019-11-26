import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import styles from './style';

const CurrentBalance = ({ amount, symbol }) => (
  <View style={styles.container}>
    <Text style={styles.balance}>{amount} {symbol}</Text>
    <Text style={styles.desc}>Current balance</Text>
  </View>
);

CurrentBalance.defaultProps = {
  amount: null,
  symbol: null
};

CurrentBalance.propTypes = {
  amount: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  symbol: PropTypes.string,
};

export default CurrentBalance;
