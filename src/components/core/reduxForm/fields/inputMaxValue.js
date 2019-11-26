import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TextInput, Text } from '@src/components/core';
import formatUtil from '@src/utils/format';
import { COLORS } from '@src/styles';
import createField from './createField';

const renderCustomField = ({ input, meta, maxValue, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;

  return (
    <TextInput
      {...props}
      onChangeText={(t) => onChange(t)}
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={value}
      prependView={(
        <TouchableOpacity
          style={{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderWidth: 1,
            borderRadius: 15,
            borderColor: COLORS.primary,
            marginBottom: 5,
          }}
          onPress={() => {
            onChange(formatUtil.number(Number(maxValue)));
          }}
        >
          <Text style={{ color: COLORS.primary  }}>Max</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const InputMaxValueField = createField({
  fieldName: 'InputMaxValueField',
  render: renderCustomField
});

renderCustomField.defaultProps = {
  maxValue: null,
};

renderCustomField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  maxValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
};

export default InputMaxValueField;
