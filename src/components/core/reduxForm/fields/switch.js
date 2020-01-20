import React from 'react';
import { Switch } from '@src/components/core';
import createField from './createField';

const renderCustomField = ({ input, meta, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;
  return <Switch {...props} onValueChange={(value) => onChange(value)} onBlur={onBlur} onFocus={onFocus} value={value} />;
};

const SwitchField = createField({
  fieldName: 'SwitchField',
  render: renderCustomField
});


export default SwitchField;
