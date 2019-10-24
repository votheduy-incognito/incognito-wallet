import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { THEME } from '@src/styles';

import chevronLeft from '@src/assets/images/icons/chevron-left-icon.png';

const BackButton = ({ onPress, width, height, size }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: width,
      paddingLeft: 5,
      height: height
    }}
  >
    <Image
      style={{
        height: size,
        width: '100%',
      }}
      resizeMode="contain"
      resizeMethod="resize"
      source={chevronLeft}
    />
  </TouchableOpacity>
);

BackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  size: PropTypes.number,
};

BackButton.defaultProps = {
  width: 50,
  size: 20,
  height: THEME.header.headerHeight,
};

export default BackButton;
