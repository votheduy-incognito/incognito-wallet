import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { CheckBox, View } from '@src/components/core';
import ErrorMessage from '@src/components/core/formik/ErrorMessage';
import styleSheet from './style';

const CheckBoxField = (props) => {
  const { name, value, error, handleChange, onFieldChange, ...others } = props;

  useEffect(() => {
    if (typeof onFieldChange === 'function') {
      onFieldChange(value);
    }
  }, [value]);
  
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
  onFieldChange: PropTypes.func
};

export default CheckBoxField;