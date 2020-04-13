import React from 'react';
import {Image} from 'react-native';
import srcThreeDotsHorIcon from '@src/assets/images/icons/three_dots_hor.png';

const ThreeDotsHorIcon = props => {
  const defaultStyle = {
    width: 4,
    height: 16,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcThreeDotsHorIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ThreeDotsHorIcon;
