import React from 'react';
import PropTypes from 'prop-types';
import { BaseTextInput as TextInput, View } from '@components/core';
import { COLORS } from '@src/styles';
import stylesheet from './style';

const Input = ({ value, onChange, disabled, placeholder, style }) => {
  return (
    <View style={[stylesheet.inputContainer, style]}>
      <TextInput
        keyboardType="decimal-pad"
        style={[stylesheet.bigText, stylesheet.input, style]}
        placeholder={onChange ? placeholder : ''}
        placeholderTextColor={COLORS.colorGreyBold}
        value={value}
        onChangeText={onChange}
        editable={!disabled}
      />
    </View>
  );
};

Input.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  style: PropTypes.object
};

Input.defaultProps = {
  value: '',
  disabled: false,
  placeholder: '',
  style: null
};

export default Input;
