import React from 'react';
import { Image } from 'react-native';
import srcInfoIcon from '@src/assets/images/icons/info_icon.png';

const InfoIcon = () => {
  return (
    <Image
      source={srcInfoIcon}
      style={{
        width: 18,
        height: 18,
      }}
    />
  );
};

export default InfoIcon;
