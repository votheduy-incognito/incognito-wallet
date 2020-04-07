import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TextInput, Image, View} from '@src/components/core';
import {openQrScanner} from '@src/components/QrCodeScanner';
import {scaleInApp} from '@src/styles/TextStyle';
import qrCodeScanner from '@src/assets/images/icons/qr_code_scanner.png';
import {AddressBookIcon} from '@src/components/Icons';
import {COLORS} from '@src/styles';
import createField from './createField';

const styled = StyleSheet.create({
  prepend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  line: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.lightGrey1,
    marginHorizontal: 10,
  },
});

const renderCustomField = ({
  input,
  onOpenAddressBook,
  showNavAddrBook,
  ...props
}) => {
  const {onChange, onBlur, onFocus, value} = input;
  return (
    <TextInput
      {...props}
      onChangeText={t => onChange(t)}
      onBlur={onBlur}
      onFocus={onFocus}
      returnKeyType="done"
      defaultValue={value}
      prependView={(
        <View style={styled.prepend}>
          {showNavAddrBook && (
            <>
              <TouchableOpacity onPress={onOpenAddressBook}>
                <AddressBookIcon />
              </TouchableOpacity>
              <View style={styled.line} />
            </>
          )}
          <TouchableOpacity
            onPress={() => {
              openQrScanner(data => {
                onChange(data);
              });
            }}
          >
            <Image
              source={qrCodeScanner}
              style={{
                width: scaleInApp(16),
                height: scaleInApp(16),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

renderCustomField.propTypes = {
  input: PropTypes.object,
  onOpenAddressBook: PropTypes.func,
  showNavAddrBook: PropTypes.bool,
};

renderCustomField.defaultProps = {
  input: null,
  onOpenAddressBook: () => null,
  showNavAddrBook: false,
};

const InputQRField = createField({
  fieldName: 'InputQRField',
  render: renderCustomField,
});

export default InputQRField;
