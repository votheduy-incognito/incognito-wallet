import React from 'react';
import { Image } from 'react-native';
import srcExclamationIcon from '@src/assets/images/icons/exclamation.png';

const ExclamationIcon = () => {
  return (
    <Image
      source={srcExclamationIcon}
      style={{
        width: 60,
        height: 60,
      }}
    />
  );
};

export default ExclamationIcon;
