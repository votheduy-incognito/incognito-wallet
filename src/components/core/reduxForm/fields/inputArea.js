import React from 'react';
import { TextInput } from '@src/components/core';
import createField from './createField';

const HEIGHT = 80;

const renderCustomField = ({ input, meta, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;
  return <TextInput numberOfLines={10} multiline containerStyle={{ height: HEIGHT }} inputStyle={{ height: HEIGHT }} {...props} onChangeText={(t) => onChange(t)} onBlur={onBlur} onFocus={onFocus} defaultValue={value} />;
};

const InputAreaField = createField({
  fieldName: 'InputAreaField',
  render: renderCustomField,
});


export default InputAreaField;
