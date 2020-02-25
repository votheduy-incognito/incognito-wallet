import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import styles from './style';

const CurrentBalance = ({ amount, symbol, select }) => (
  <View style={styles.container}>
    <View style={styles.balanceContainer}>
      <Text style={styles.balance} numberOfLines={1} ellipsizeMode='tail'>{amount}</Text>
      <Text style={styles.balanceSymbol} numberOfLines={1} ellipsizeMode='tail'>{symbol}</Text>
      { select ? select : null }
    </View>
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
