import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import srcBackIcon from '@src/assets/images/icons/back.png';

const styled = StyleSheet.create({
  defaultStyle: {
    width: 12,
    height: 20,
  },
});

const ReadIcon = props => {
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcBackIcon}
      style={[styled.defaultStyle, style]}
      {...rest}
    />
  );
};

export default ReadIcon;
