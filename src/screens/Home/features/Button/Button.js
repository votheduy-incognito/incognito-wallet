import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import { styled } from './Button.styled';

const Button = props => {
  const { onPress, icoUrl, title, desc, disabled } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styled.container, disabled && styled.disabled]}>
        <Image
          style={styled.image}
          source={{ uri: icoUrl || '' }}
          resizeMode="contain"
        />
        <View style={styled.hook}>
          {!!title && (
            <Text style={styled.title} ellipsizeMode="tail" numberOfLines={1}>
              {title}
            </Text>
          )}
          {!!desc && (
            <Text style={styled.desc} ellipsizeMode="tail" numberOfLines={1}>
              {desc}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  icoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

Button.defaultProps = {
  disabled: false,
};

export default Button;
