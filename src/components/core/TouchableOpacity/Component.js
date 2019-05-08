import React from 'react';
import { TouchableOpacity as RNComponent } from 'react-native';

const TouchableOpacity = (props) => <RNComponent activeOpacity={0.7} {...props} />;

export default TouchableOpacity;