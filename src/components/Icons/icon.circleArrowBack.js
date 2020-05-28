import React from 'react';
import { Image, StyleSheet } from 'react-native';
import srcCircleArrowBackIcon from '@src/assets/images/icons/circle_arrow_back.png';
import PropTypes from 'prop-types';

const styled = StyleSheet.create({
  defaultStyle: {
    width: 24,
    height: 24,
  },
});

const CircleArrowBackIcon = props => {
  const { style = null, source = srcCircleArrowBackIcon, ...rest } = props;
  return (
    <Image source={source} style={[styled.defaultStyle, style]} {...rest} />
  );
};

CircleArrowBackIcon.propTypes = {
  style: PropTypes.any,
  source: PropTypes.string,
};

export default CircleArrowBackIcon;
