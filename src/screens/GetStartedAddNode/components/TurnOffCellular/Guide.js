import { Text, View } from '@src/components/core';
import React from 'react';
import styles from '../../styles';

const Guide = () => (
  <View style={styles.guide}>
    <View style={{ marginTop: 20 }}>
      <Text style={[styles.guideLine]}>
        <Text style={[styles.bold]}>Step 1: &nbsp;</Text>Go to network settings
      </Text>
      <Text style={[styles.guideLine]}>
        <Text style={styles.bold}>Step 2: &nbsp;</Text>Turn off cellular/mobile data
      </Text>
    </View>
  </View>
);

export default Guide;
