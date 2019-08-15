import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME } from '@src/styles';

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
    <Icon name='chevron-left' color='white' size={30} />
  </TouchableOpacity>
);

BackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default BackButton;
