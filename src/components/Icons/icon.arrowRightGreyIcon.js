import React from 'react';
import {Image} from 'react-native';
import chevronRight from '@src/assets/images/icons/icon_chevron_right.png';

const ArrowRightGreyIcon = props => {
  const defaultStyle = {
    width: 8,
    height: 14,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={chevronRight}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ArrowRightGreyIcon;
