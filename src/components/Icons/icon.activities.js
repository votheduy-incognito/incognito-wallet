import React from 'react';
import {Image} from 'react-native';
import srcAddressBookIcon from '@src/assets/images/icons/activities_icon.png';

const ActivitiesIcon = props => {
  const defaultStyle = {
    width: 24,
    height: 18,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcAddressBookIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default ActivitiesIcon;
