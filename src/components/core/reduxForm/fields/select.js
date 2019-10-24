import React from 'react';
import { Select } from '@src/components/core';
import createField from './createField';

const renderCustomField = ({ input, meta, ...props }) => {
  const { onChange, value } = input;
  return <Select {...props} onChangeText={(t) => onChange(t)} defaultValue={value} />;
};

const InputField = createField({
  fieldName: 'InputField',
  render: renderCustomField
});


export default InputField;
