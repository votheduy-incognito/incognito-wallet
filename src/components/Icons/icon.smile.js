import React from 'react';
import {Image} from 'react-native';
import srcSmileIcon from '@src/assets/images/icons/smile_icon.png';

const SmileIcon = props => {
  const defaultStyle = {
    width: 24,
    height: 24,
  };
  const {style, source, ...rest} = props;
  return (
    <Image source={srcSmileIcon} style={[defaultStyle, style]} {...rest} />
  );
};

export default SmileIcon;
