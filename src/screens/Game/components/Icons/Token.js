import React from 'react';
import { Image, StyleSheet } from 'react-native';
import token from './token.png';

const Token = () => (
  <Image source={token} style={styles.image} />
);

const styles = StyleSheet.create({
  image: {
    width: 122,
    height: 40,
    position: 'absolute',
    left: 0,
    top: -4,
  }
});

export default Token;
