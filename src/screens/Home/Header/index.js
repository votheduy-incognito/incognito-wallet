import React from 'react';
import { View, Text, Image } from '@src/components/core';
import SettingIcon from '@components/SettingIcon';
import homeSecurity from '@assets/images/home_security.png';
import styles from './style';

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <SettingIcon />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Go Incognito</Text>
        <Text style={styles.desc}>A privacy-first alternative</Text>
        <Text style={styles.desc}>for all your crypto activities.</Text>
        <Image style={styles.image} source={homeSecurity} />
      </View>
    </View>
  );
};

export default HomeHeader;
