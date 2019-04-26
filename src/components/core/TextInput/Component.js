import React from 'react';
import { TextInput as RNComponent } from 'react-native';
import styleSheet from './style';

const TextInput = ({ style, ...props }) => <RNComponent {...props} style={[styleSheet.container, style]} />;

export default TextInput;