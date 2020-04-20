import React from 'react';
import {Image} from 'react-native';
import srcOpenByWebIcon from '@src/assets/images/icons/external.png';

const OpenByWebIcon = props => {
  const defaultStyle = {
    width: 12,
    height: 12,
  };
  const {style, source, ...rest} = props;
  return (
    <Image source={srcOpenByWebIcon} style={[defaultStyle, style]} {...rest} />
  );
};

export default OpenByWebIcon;
