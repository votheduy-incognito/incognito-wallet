import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import roll from './RollButton.png';

const RollButton = ({ onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <Image source={roll} style={styles.image} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  image: {
    width: 66,
    height: 66,
  }
});

RollButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

RollButton.defaultProps = {
  disabled: false,
};

export default RollButton;
