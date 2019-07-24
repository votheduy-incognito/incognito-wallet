import React from 'react';
import { View, Text } from '@src/components/core';
import style from './style';

const customField = (field, render) => {
  return (
    <View style={style.container}>
      <View style={style.field}>
        {render(field)}
      </View>
      {field?.meta?.touched && field?.meta?.error && <Text style={style.errorText}>{field.meta.error}</Text>}
    </View>
  );
};


const createField = ({ fieldName, render }) => (field) => {
  const CustomField = customField(field, render);
  CustomField.displayName = fieldName;
  return CustomField;
};

export default createField;
