import React from 'react';
import { ActivityIndicator as RNComponent,Platform } from 'react-native';
import { THEME } from '@src/styles';

const ActivityIndicator = (props) => {
  const {size='small'} = props;
  return (
    <RNComponent
      color={THEME.indicator.color}
      {...props}
      size={Platform.OS === 'ios'?'large':size}
    />
  );
};

export default ActivityIndicator;