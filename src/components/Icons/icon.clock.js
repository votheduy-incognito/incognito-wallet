import React from 'react';
import {Image} from 'react-native';
import srcClockIcon from '@src/assets/images/icons/clock.png';

const ClockIcon = props => {
  const defaultStyle = {
    width: 50,
    height: 50,
  };
  const {style, source, ...rest} = props;
  return (
    <Image source={srcClockIcon} style={[defaultStyle, style]} {...rest} />
  );
};

export default ClockIcon;
