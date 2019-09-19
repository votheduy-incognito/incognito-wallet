import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Privacy from './prv.png';

const PRV = () => (
  <Image source={Privacy} style={styles.image} />
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

export default PRV;
