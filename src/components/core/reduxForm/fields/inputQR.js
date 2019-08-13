import React from 'react';
import { TouchableOpacity, TextInput } from '@src/components/core';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { openQrScanner } from '@src/components/QrCodeScanner';
import createField from './createField';

const renderCustomField = ({ input, meta, ...props }) => {
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
            padding: 10,
          }}
          onPress={() => {
            openQrScanner(data => {
              onChange(data);
            });
          }}
        >
          <MaterialCommunityIcons name='qrcode-scan' size={20} />
        </TouchableOpacity>
      )}
    />
  );
};

const InputQRField = createField({
  fieldName: 'InputQRField',
  render: renderCustomField
});


export default InputQRField;
