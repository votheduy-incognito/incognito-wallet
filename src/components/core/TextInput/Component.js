import PropTypes from 'prop-types';
import React from 'react';
import { TextInput as RNComponent, View } from 'react-native';
import styleSheet from './style';

const TextInput = ({ containerStyle, inputStyle, prependView, ...props }) => (
  <View style={[styleSheet.container, containerStyle]}>
    <RNComponent {...props} style={[styleSheet.input, inputStyle]} />
    {prependView}
  </View>
);

TextInput.propTypes = {
  containerStyle: PropTypes.objectOf(PropTypes.object),
  inputStyle: PropTypes.objectOf(PropTypes.object),
  prependView: PropTypes.element
};

export default TextInput;
