import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TextInput as RNComponent, View, Text } from 'react-native';
import styleSheet from './style';

const TextInput = ({ containerStyle, inputStyle, style, prependView, label, onFocus, onBlur, ...props }) => {
  const [focus, setFocus] = useState(false);

  function handleFocus() {
    setFocus(true);
    if (typeof onFocus === 'function') {
      onFocus.apply(this, arguments);
    }
  }

  function handleBlur() {
    setFocus(false);
    if (typeof onBlur === 'function') {
      onBlur.apply(this, arguments);
    }
  }

  return (
    <View style={styleSheet.container, style}>
      {label && <Text style={[styleSheet.label, focus && styleSheet.labelFocus]}>{label}</Text>}
      <View
        style={[
          styleSheet.row,
          containerStyle,
          focus && styleSheet.focus
        ]}
      >
        <RNComponent
          {...props}
          style={[
            styleSheet.input,
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {prependView}
      </View>
    </View>
  );
};

TextInput.defaultProps = {
  label: null,
  containerStyle: null,
  inputStyle: null,
  prependView: null
};

TextInput.propTypes = {
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  prependView: PropTypes.element,
  label: PropTypes.string,
};

export default TextInput;
