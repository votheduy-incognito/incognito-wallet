import React from 'react';
import { Text as RNComponent } from 'react-native';
import styleSheet from './style';

const Text = (props) => <RNComponent {...props} style={styleSheet.root} />;

export default Text;