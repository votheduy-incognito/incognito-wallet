import React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import { COLORS } from '@src/styles';

const ChevronIcon = (props) => (
  <Icon
    name={`chevron-thin-${props?.toggle ? 'up' : 'down'}`}
    size={props?.size || 20}
    color={COLORS.colorGreyBold}
  />
);

export default React.memo(ChevronIcon);
