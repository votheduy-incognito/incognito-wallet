import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text } from '@src/components/core';
import SettingIcon from '@components/SettingIcon';
import styles from './style';

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Incognito</Text>
      <View style={styles.icon}>
        <SettingIcon />
      </View>
    </View>
  );
};

export default HomeHeader;
