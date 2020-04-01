import React from 'react';
import {Image} from 'react-native';
import srcReadIcon from '@src/assets/images/icons/mark_read.png';

const ReadIcon = props => {
  const defaultStyle = {
    width: 18,
    height: 18,
  };
  const {style, source, ...rest} = props;
  return <Image source={srcReadIcon} style={[defaultStyle, style]} {...rest} />;
};

export default ReadIcon;
