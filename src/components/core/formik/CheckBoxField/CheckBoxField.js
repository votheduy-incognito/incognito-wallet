import React from 'react';
import PropTypes from 'prop-types';
import { CheckBox, View } from '@src/components/core';
import ErrorMessage from '@src/components/core/formik/ErrorMessage';
import styleSheet from './style';

const CheckBoxField = (props) => {
  const { name, value, error, handleChange, ...others } = props;
  return (
    <View style={styleSheet.container}>
      <CheckBox
        {...others}
        onValueChange={handleChange(name)}
        value={value}
      />
      <ErrorMessage error={error} />
    </View>
    
  );
};

CheckBoxField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.bool,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default CheckBoxField;