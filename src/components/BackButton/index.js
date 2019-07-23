import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity } from '@src/components/core';
import backIcon from '@src/assets/images/icons/back.png';

const BackButton = ({ onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{ padding: 20, height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <Image source={backIcon} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
  </TouchableOpacity>
);

BackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default BackButton;
