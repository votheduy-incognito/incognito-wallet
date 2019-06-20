import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import styleSheet from './style';

const genStyle = ({ height, color }) => {
  const styleHeight = height > 0 ? { height: height } : {};
  const styleColor = color ? { backgroundColor: color } : {};
  const customStyle = { ...styleHeight, ...styleColor };
  return StyleSheet.create({
    // eslint-disable-next-line react-native/no-unused-styles
    customStyle: customStyle
  });
};

const Divider = ({ height, color, style }) => (
  <View
    style={[
      styleSheet.container,
      genStyle({ height, color }).customStyle,
      style
    ]}
  />
);

Divider.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.objectOf(PropTypes.object)
};

export default Divider;
