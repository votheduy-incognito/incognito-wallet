import { TextInput, TouchableOpacity } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { scaleInApp } from '@src/styles/TextStyle';
import React from 'react';
import { Icon } from 'react-native-elements';
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
            height: '100%',
            paddingLeft: 15,
            justifyContent: 'center'
          }}
          onPress={() => {
            openQrScanner(data => {
              onChange(data);
            });
          }}
        >
          <Icon type='material-community' name='qrcode-scan' size={scaleInApp(20)} />
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
