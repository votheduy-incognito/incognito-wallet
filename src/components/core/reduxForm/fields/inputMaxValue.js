import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, TextInput, Text } from '@src/components/core';
import formatUtil from '@src/utils/format';
import { COLORS } from '@src/styles';
import { generateTestId } from '@utils/misc';
import { SEND } from '@src/constants/elements';
import { BtnInfinite } from '@src/components/Button';
import createField from './createField';

const renderCustomField = ({ input, meta, maxValue, autoFocus, onPressMax = null, ...props }) => {
  const { onChange, onBlur, onFocus, value } = input;
  let inputRef;
  return (
    <TextInput
      {...props}
      onChangeText={t => {
        input.onChange(t);
      }}
      onBlur={onBlur}
      onFocus={onFocus}
      defaultValue={value}
      returnKeyType="done"
      onRef={ref => {
        inputRef = ref;
      }}
      // prependView={(
      //   <TouchableOpacity
      //     style={{
      //       paddingHorizontal: 15,
      //       paddingVertical: 5,
      //       borderWidth: 1,
      //       borderRadius: 15,
      //       borderColor: COLORS.primary,
      //       marginBottom: 5,
      //     }}
      //     onPress={() => {
      //       input.onChange(
      //         formatUtil.numberWithNoGroupSeparator(Number(maxValue)),
      //       );
      //       inputRef?.current?.focus?.();
      //     }}
      //     {...generateTestId(SEND.MAX_BUTTON)}
      //   >
      //     <Text style={{ color: COLORS.primary }}>Max</Text>
      //   </TouchableOpacity>
      // )}
      prependView={(
        <BtnInfinite
          style={{
            padding: 5,
          }}
          onPress={() => {
            if(typeof onPressMax === 'function'){
              return onPressMax();
            }
            input.onChange(
              formatUtil.numberWithNoGroupSeparator(Number(maxValue)),
            );
            inputRef?.current?.focus?.();
          }}
          {...generateTestId(SEND.MAX_BUTTON)}
        />
      )}
    />
  );
};

const InputMaxValueField = createField({
  fieldName: 'InputMaxValueField',
  render: renderCustomField,
});

renderCustomField.defaultProps = {
  maxValue: null,
};

renderCustomField.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  maxValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onPressMax: PropTypes.func
};

export default InputMaxValueField;
