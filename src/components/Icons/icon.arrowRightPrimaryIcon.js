import React from 'react';
import {Image} from 'react-native';
import srcArrowRightPrimaryIcon from '@src/assets/images/icons/arrow_right_primary_icon.png';

const ArrowRightPrimaryIcon = props => {
  const defaultStyle = {
    width: 8,
    height: 14,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcArrowRightPrimaryIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ArrowRightPrimaryIcon;
