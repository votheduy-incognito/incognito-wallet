import React from 'react';
import { Image } from 'react-native';
import srcRetryIcon from '@src/assets/images/icons/retry.png';

const RetryIcon = (props) => {
  const defaultStyle = {
    width: 56,
    height: '100%',
  };
  return (
    <Image
      source={srcRetryIcon}
      style={[defaultStyle, props?.styledIcon]}
      {...props}
    />
  );
};

export default React.memo(RetryIcon);
