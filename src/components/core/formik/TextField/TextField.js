import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextInput, View } from '@src/components/core';
import ErrorMessage from '@src/components/core/formik/ErrorMessage';
import styleSheet from './style';

const FormTextField = (props) => {
  const { name, value, error, handleChange, handleBlur, onFieldChange, ...others } = props;
 
  useEffect(() => {
    if (typeof onFieldChange === 'function') {
      onFieldChange(value);
    }
  }, [value]);

  return (
    <View style={styleSheet.container}>
      <TextInput
        {...others}
        onChangeText={handleChange(name)}
        onBlur={handleBlur(name)}
        value={value}
      />
      <ErrorMessage error={error} />
    </View>
    
  );
};

FormTextField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  onFieldChange: PropTypes.func
};

export default FormTextField;