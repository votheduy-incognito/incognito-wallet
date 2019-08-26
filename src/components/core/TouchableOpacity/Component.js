import React from 'react';
import { TouchableOpacity as RNComponent } from 'react-native';

const TouchableOpacity = (props) => <RNComponent {...props} activeOpacity={0.9} />;

export default TouchableOpacity;