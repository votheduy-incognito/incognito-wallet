import React from 'react';
import {Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  icon: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

const CircleIcon = props => {
  const {style} = props;
  return <Image source={null} style={[styled.icon, style]} />;
};

CircleIcon.defaultProps = {
  style: {},
};

CircleIcon.propTypes = {
  style: PropTypes.any,
};

export default CircleIcon;
