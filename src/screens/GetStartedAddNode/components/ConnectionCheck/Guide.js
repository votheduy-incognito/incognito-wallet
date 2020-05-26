import {Text, View} from '@src/components/core';
import React from 'react';
import {isIOS} from '@utils/platform';
import {Icon} from 'react-native-elements';
import {COLORS} from '@src/styles';
import styles from '../../styles';

const Guide = () => (
  <View style={styles.guide}>
    {isIOS() ? (
      <View style={[styles.row, styles.center]}>
        <Text>Settings</Text>
        <Icon
          containerStyle={styles.icon}
          color={COLORS.lightGrey2}
          name="chevron-right"
        />
        <Text>Wifi</Text>
        <Icon
          containerStyle={styles.icon}
          color={COLORS.lightGrey2}
          name="chevron-right"
        />
        <Text>On</Text>
      </View>
    ) : (
      <View style={{marginTop: 10}}>
        <Text style={[styles.guideLine]}>
          <Text style={[styles.bold]}>Step 1:</Text>
          &nbsp;Swipe down from the top of your screen
        </Text>
        <Text style={[styles.guideLine]}>
          <Text style={styles.bold}>Step 2:</Text>
          &nbsp;Turn on your node device
        </Text>
        <Text style={[styles.guideLine]}>
          <Text style={styles.bold}>Step 3:</Text>
          &nbsp;Turn on your wifi
        </Text>
      </View>
    )}
  </View>
);

export default Guide;
