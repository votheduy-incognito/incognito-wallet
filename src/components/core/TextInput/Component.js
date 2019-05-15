import React from 'react';
import PropTypes from 'prop-types';
import { TextInput as RNComponent, View } from 'react-native';
import styleSheet from './style';

const TextInput = ({ containerStyle, inputStyle, prependView, ...props }) => (
  <View style={[styleSheet.container, containerStyle]}>
    <RNComponent {...props} style={[styleSheet.input, inputStyle]} />
    {prependView}
  </View>
);

TextInput.propTypes = {
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  prependView: PropTypes.element
};

export default TextInput;