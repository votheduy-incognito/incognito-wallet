import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { THEME } from '@src/styles';

import chevronLeft from '@src/assets/images/icons/chevron-left-icon.png';

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      display: 'flex',
      justifyContent: 'center',
      width: 50,
      paddingLeft: 5,
      height: THEME.header.headerHeight
    }}
  >
    <Image
      style={{
        height: 20,
        width: '100%',
      }}
      resizeMode="contain"
      resizeMethod="resize"
      source={chevronLeft} />
  </TouchableOpacity>
);

BackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default BackButton;
