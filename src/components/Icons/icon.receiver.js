import React from 'react';
import {Image} from 'react-native';
import srcReceiverIcon from '@src/assets/images/icons/receiver.png';

const ReceiverIcon = props => {
  const defaultStyle = {
    width: 20,
    height: 20,
  };
  const {style, source, ...rest} = props;
  return (
    <Image source={srcReceiverIcon} style={[defaultStyle, style]} {...rest} />
  );
};

export default ReceiverIcon;
