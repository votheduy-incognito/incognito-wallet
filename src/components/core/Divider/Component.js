import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import styleSheet from './style';

const genStyle = ({ height, color }) => StyleSheet.create({
  customStyle: {
    ...height > 0 ? { height } : {},
    ...color ? { backgroundColor: color } : {}
  }
});

const Divider = ({ height, color, style }) => <View style={[styleSheet.container, genStyle({ height, color }).customStyle, style]} />;

Divider.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object
};

export default Divider;