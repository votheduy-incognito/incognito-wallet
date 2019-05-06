import React from 'react';
import PropTypes from 'prop-types';
import { Picker, View } from '@src/components/core';
import ErrorMessage from '@src/components/core/formik/ErrorMessage';
import styleSheet from './style';

const PickerField = (props) => {
  const { name, value, error, children, handleChange, ...others } = props;
  const items = children.constructor === Array ? [...children] : [children];

  if (value === undefined) {
    items.unshift(<Picker.Item label='Select' />);
  }

  return (
    <View style={styleSheet.container}>
      <Picker
        {...others}
        onValueChange={handleChange(name)}
        selectedValue={value}
      >{items}</Picker>
      <ErrorMessage error={error} />
    </View>
  );
};

PickerField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  error: PropTypes.string,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ])
};

export default PickerField;