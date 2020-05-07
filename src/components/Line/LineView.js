import React from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  container: {
    height: 0.5,
    width: '100%',
    marginVertical: 10,
  },
});

const LineView = ({ height, color, style }) => {
  return <View style={[styled.container, { height: height, backgroundColor: color }, style]} />;
};

LineView.defaultProps = {
  height: 1,
  color: COLORS.black,
  style: {}
};

LineView.propTypes = {
  height: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.any
};

export default LineView;
