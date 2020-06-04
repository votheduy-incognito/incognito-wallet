import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNComponent } from 'react-native';

const TouchableOpacity = ({ onPress, activeOpacity = 0.2, ...props }) => {
  const _onPress = () => {
    requestAnimationFrame(() => {
      if (typeof onPress === 'function') {
        onPress();
      }
    });
  };

  return (
    <RNComponent {...props} onPress={_onPress} activeOpacity={activeOpacity} />
  );
};

TouchableOpacity.defaultProps = {
  activeOpacity: undefined,
};

TouchableOpacity.propTypes = {
  onPress: PropTypes.func.isRequired,
  activeOpacity: PropTypes.number,
};

export default TouchableOpacity;
