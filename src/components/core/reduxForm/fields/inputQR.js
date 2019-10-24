import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, TouchableOpacity, Image } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { scaleInApp } from '@src/styles/TextStyle';
import qrCodeScanner from '@src/assets/images/icons/qr_code_scanner.png';
import createField from './createField';

const renderCustomField = ({ input, ...props }) => {
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
          <Image
            source={qrCodeScanner}
            style={{
              width: scaleInApp(20),
              height: scaleInApp(20),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      )}
    />
  );
};

renderCustomField.propTypes = {
  input: PropTypes.object,
};

renderCustomField.defaultProps = {
  input: null,
};

const InputQRField = createField({
  fieldName: 'InputQRField',
  render: renderCustomField
});


export default InputQRField;
