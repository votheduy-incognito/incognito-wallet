import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity as RNComponent } from 'react-native';
import { Text } from '@src/components/core';
import styleSheet from './style';

const Button = ({ title, children, style, titleStyle, type, ...props }) => (
  <RNComponent {...props} style={[styleSheet.button, type && styleSheet[`${type}Style`], style]} activeOpacity={0.9}>
    {
      children || <Text style={[styleSheet.text, titleStyle]} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
    }
  </RNComponent>
);

Button.propTypes = {
  style: PropTypes.object,
  titleStyle: PropTypes.object,
  title: PropTypes.string,
  children: PropTypes.oneOfType(PropTypes.node, PropTypes.arrayOf(PropTypes.node)),
  type: PropTypes.oneOf([
    'primary',
    'danger',
  ])
};

export default Button;