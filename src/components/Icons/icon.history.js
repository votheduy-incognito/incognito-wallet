import React from 'react';
import {Image} from 'react-native';
import srcHistoryIcon from '@src/assets/images/icons/history.png';

const HistoryIcon = () => {
  return (
    <Image
      source={srcHistoryIcon}
      style={{
        width: 22,
        height: 20,
        marginRight: 20
      }}
    />
  );
};

export default HistoryIcon;
