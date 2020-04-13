import React from 'react';
import {Image} from 'react-native';
import srcArrowRightGreyIcon from '@src/assets/images/icons/arrow_right_grey.png';

const ArrowRightGreyIcon = props => {
  const defaultStyle = {
    width: 8,
    height: 14,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcArrowRightGreyIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ArrowRightGreyIcon;
