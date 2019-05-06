import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNComponent } from 'react-native';
import { Text } from '@src/components/core';
import styleSheet from './style';

const Button = ({ title, children, style, titleStyle, ...props }) => (
  <RNComponent {...props} style={[styleSheet.button, style]} activeOpacity={0.9}>
    {
      children || <Text style={[styleSheet.text, titleStyle]} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
    }
  </RNComponent>
);

Button.propTypes = {
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.oneOfType(PropTypes.node, PropTypes.arrayOf(PropTypes.node))
};

export default Button;