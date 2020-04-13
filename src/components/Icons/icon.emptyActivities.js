import React from 'react';
import {Image} from 'react-native';
import srcEmptyActivitiesIcon from '@src/assets/images/icons/empty_activities.png';

const EmptyActivitiesIcon = props => {
  const defaultStyle = {
    width: 70,
    height: 70,
  };
  const {style, source, ...rest} = props;
  return (
    <Image
      source={srcEmptyActivitiesIcon}
      style={[defaultStyle, style]}
      {...rest}
    />
  );
};

export default EmptyActivitiesIcon;
