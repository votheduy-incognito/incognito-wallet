import React from 'react';
import { ActivityIndicator as RNComponent } from 'react-native';
import { THEME } from '@src/styles';

const ActivityIndicator = (props) => (
  <RNComponent
    color={THEME.indicator.color}
    {...props}
  />
);

export default ActivityIndicator;