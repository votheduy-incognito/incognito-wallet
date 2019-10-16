import { TouchableOpacity } from '@src/components/core';
import { THEME } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'react-native-elements';

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
    <Icon name='chevron-left' type='material-community' color='white' size={30} />
  </TouchableOpacity>
);

BackButton.propTypes = {
  onPress: PropTypes.func.isRequired,
};

export default BackButton;
