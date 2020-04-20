import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TextInput, Text } from '@src/components/core';
import formatUtil from '@src/utils/format';
import { COLORS } from '@src/styles';
import {generateTestId} from '@utils/misc';
import {SEND} from '@src/constants/elements';
import createField from './createField';

let inputRef;

const renderCustomField = ({ input, meta, maxValue, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;

  return (
    <TextInput
      {...props}
      onChangeText={(t) => onChange(t)}
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={value}
      returnKeyType="done"
      onRef={(ref) => {
        inputRef = ref;
      }}
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
            onChange(formatUtil.numberWithNoGroupSeparator(Number(maxValue)));
            inputRef?.current?.focus?.();
          }}
          {...generateTestId(SEND.MAX_BUTTON)}
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
