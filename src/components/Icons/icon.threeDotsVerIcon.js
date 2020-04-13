import React from 'react';
import {Image} from 'react-native';
import srcThreeDotsVerIcon from '@src/assets/images/icons/three_dots_ver.png';

const ThreeDotsVerIcon = props => {
  const defaultStyle = {
    width: 22,
    height: 6,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcThreeDotsVerIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ThreeDotsVerIcon;
