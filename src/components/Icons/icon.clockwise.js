import React from 'react';
import { Image } from 'react-native';
import srcClockWiseIcon from '@src/assets/images/icons/clockwise.png';

const ClockWiseIcon = () => {
  return (
    <Image
      source={srcClockWiseIcon}
      style={{
        width: 60,
        height: 60,
      }}
    />
  );
};

export default ClockWiseIcon;
