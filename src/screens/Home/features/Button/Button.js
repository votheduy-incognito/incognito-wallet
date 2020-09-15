import React from 'react';
import { View, Image, Text } from 'react-native';
import PropTypes from 'prop-types';
import { TouchableOpacity } from '@src/components/core';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import { styled } from './Button.styled';

const Button = props => {
  const { onPress, icoUrl, title, desc, key } = props;
  const [onFeaturePress, isDisabled] = useFeatureConfig(key, onPress);

  return (
    <TouchableOpacity onPress={onFeaturePress}>
      <View style={[styled.container, isDisabled && styled.disabled]}>
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
  key: PropTypes.string.isRequired,
};

export default Button;
