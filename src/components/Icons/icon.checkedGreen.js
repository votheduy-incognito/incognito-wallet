import React from 'react';
import {Image} from 'react-native';
import srcSearchIcon from '@src/assets/images/icons/checked_green.png';

const CheckedGreenIcon = () => {
  return (
    <Image
      source={srcSearchIcon}
      style={{
        width: 50,
        height: 50,
      }}
    />
  );
};

export default CheckedGreenIcon;
