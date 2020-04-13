import React from 'react';
import {Image} from 'react-native';
import srcBackIcon from '@src/assets/images/icons/back.png';

const ReadIcon = props => {
  const defaultStyle = {
    width: 10,
    height: 18,
  };
  const {style, source, ...rest} = props;
  return <Image source={srcBackIcon} style={[defaultStyle, style]} {...rest} />;
};

export default ReadIcon;
