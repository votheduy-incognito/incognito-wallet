import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text } from '@src/components/core';
import SettingIcon from '@components/SettingIcon';
import styles from './style';

const HomeHeader = () => {
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={[
        '#063436',
        '#006970'
      ]}
      style={styles.container}
    >
      <Text style={styles.title}>Incognito</Text>
      <View style={styles.icon}>
        <SettingIcon />
      </View>
    </LinearGradient>
  );
};

export default HomeHeader;
