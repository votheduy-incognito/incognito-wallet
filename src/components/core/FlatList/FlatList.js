import React from 'react';
import { FlatList } from 'react-native';

export default props => (
  <FlatList
    {...props}
    showsVerticalScrollIndicator={props?.showsVerticalScrollIndicator || false}
  />
);
