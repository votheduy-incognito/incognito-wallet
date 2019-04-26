import React from 'react';
import PropTypes from 'prop-types';
import { TextInput } from '@core';

const FormTextField = (props) => {
  const { name, value, handleChange, handleBlur } = props;
  return (
    <TextInput
      onChangeText={handleChange(name)}
      onBlur={handleBlur(name)}
      value={value}
    />
  );
};

FormTextField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
};

export default FormTextField;