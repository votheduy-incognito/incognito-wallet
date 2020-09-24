import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, RoundCornerButton } from '@components/core';
import styles from './style';

const WelcomeFirstTime = ({ onPressOk }) => (
  <View style={styles.container}>
    <View style={styles.pNode}>
      <Text style={styles.title}>Welcome to the network!</Text>
      <Text style={styles.description}>
        Thank you for powering privacy. Nodes are randomly selected to create blocks and earn. First earnings most commonly show up within 14 days.
      </Text>
      <RoundCornerButton
        style={styles.button}
        onPress={onPressOk}
        title='OK'
      />
    </View>
  </View>
);

WelcomeFirstTime.propTypes = {
  onPressOk: PropTypes.func.isRequired,
};

export default WelcomeFirstTime;
