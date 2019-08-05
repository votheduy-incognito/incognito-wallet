import React from 'react';
import { View, Text } from '@src/components/core';
import styleSheet from './style';

const customField = (field, render) => {
  const { style, componentProps, ...fieldProps } = field;
  const renderProps = {
    ...fieldProps,
    ...typeof componentProps === 'object' ? componentProps : {}
  };
  return (
    <View style={[styleSheet.container, style]}>
      <View style={styleSheet.field}>
        {render(renderProps)}
      </View>
      {fieldProps?.meta?.touched && fieldProps?.meta?.error && <Text style={styleSheet.errorText}>{fieldProps.meta.error}</Text>}
    </View>
  );
};


const createField = ({ fieldName, render }) => (field) => {
  const CustomField = customField(field, render);
  CustomField.displayName = fieldName;
  return CustomField;
};

export default createField;
