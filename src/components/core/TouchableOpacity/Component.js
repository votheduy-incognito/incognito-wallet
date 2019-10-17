import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNComponent } from 'react-native';

const TouchableOpacity = ({ onPress, ...props }) => {
  const _onPress = () => {
    requestAnimationFrame(() => {
      onPress();
    });
  };

  return <RNComponent {...props} onPress={_onPress} activeOpacity={0.9} />;
};

TouchableOpacity.propTypes = {
  onPress: PropTypes.func.isRequired
};

export default TouchableOpacity;