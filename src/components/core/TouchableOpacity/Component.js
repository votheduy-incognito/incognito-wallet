import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNComponent } from 'react-native';

const TouchableOpacity = ({ onPress, activeOpacity, ...props }) => {
  const _onPress = () => {
    requestAnimationFrame(() => {
      if (typeof onPress === 'function') {
        onPress();
      }
    });
  };

  return <RNComponent {...props} onPress={_onPress} activeOpacity={activeOpacity || 0.9} />;
};

TouchableOpacity.defaultProps = {
  activeOpacity: undefined,
};

TouchableOpacity.propTypes = {
  onPress: PropTypes.func.isRequired,
  activeOpacity: PropTypes.number,
};

export default TouchableOpacity;
