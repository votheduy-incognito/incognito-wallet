import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Button } from '@components/core';

import styles from './style';

const InvestReward = ({ onPress, reward }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.description}>Your returns</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Text style={[styles.reward, styles.bold]}>{reward}</Text>
        <Text style={styles.symbol}>PRV</Text>
      </View>
    </View>
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Invest more" onPress={onPress} style={styles.btn} />
    </View>
  </View>
);

InvestReward.propTypes = {
  onPress: PropTypes.func.isRequired,
  reward: PropTypes.string.isRequired,
};

export default InvestReward;
