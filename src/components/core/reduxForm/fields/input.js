import React from 'react';
import { TextInput } from '@src/components/core';
import createField from './createField';

const renderCustomField = ({ input, meta, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;
  return <TextInput {...props} onChangeText={(t) => onChange(t)} onBlur={onBlur} onFocus={onFocus} defaultValue={value} />;
};

const InputField = createField({
  fieldName: 'InputField',
  render: renderCustomField
});


export default InputField;
