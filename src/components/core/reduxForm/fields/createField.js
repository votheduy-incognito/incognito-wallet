import React from 'react';
import { View, Text } from '@src/components/core';
import styleSheet from './style';

const customField = (field, render) => {
  const { style, componentProps, meta, warning, ...fieldProps } = field;
  const renderProps = {
    ...fieldProps,
    ...(typeof componentProps === 'object' ? componentProps : {}),
  };
  const shouldShowError = (meta?.visited || meta?.touched) && meta?.error;
  const shouldShowWarning =
    (meta?.visited || meta?.touched) && warning && !meta?.error;

  return (
    <View style={[styleSheet.container, style]}>
      <View style={styleSheet.field}>{render(renderProps)}</View>
      {shouldShowError && (
        <Text style={styleSheet.errorText}>{meta.error}</Text>
      )}
      {shouldShowWarning && (
        <Text style={styleSheet.warningText}>{warning}</Text>
      )}
    </View>
  );
};

const createField = ({ fieldName, render }) => (field) => {
  const CustomField = customField(field, render);
  CustomField.displayName = fieldName;
  return CustomField;
};

export default createField;
