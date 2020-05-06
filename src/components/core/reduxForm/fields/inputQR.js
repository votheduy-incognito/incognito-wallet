import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Image, View } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { scaleInApp } from '@src/styles/TextStyle';
import qrCodeScanner from '@src/assets/images/icons/qr_code_scanner.png';
import { AddressBookIcon } from '@src/components/Icons';
import { COLORS } from '@src/styles';
import { generateTestId } from '@utils/misc';
import { SEND } from '@src/constants/elements';
import { change, Field, formValueSelector, isValid } from 'redux-form';
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

// We have to support user use this format: "bitcoin:AS3sa...", and this currently format: "abdcdFAS..."
// And also need to check generic data type
const getAddress = (text) => {
  if (text && typeof text === 'string') {
    let indexSpec = text.indexOf(':');
    if (indexSpec != -1) {
      return text.substring(indexSpec + 1, text.length);
    } else {
      return text;
    }
  } else {
    return '';
  }
};

const renderCustomField = ({
  input,
  onOpenAddressBook,
  showNavAddrBook,
  ...props
}) => {
  const { onChange, onBlur, onFocus, value } = input;
  return (
    <TextInput
      {...props}
      // Damn, it should be the like below, but temporary   
      // onChangeText={t => input.onChange(t)}
      onChangeText={t => input.onChange(t)}
      onBlur={onBlur}
      onFocus={onFocus}
      returnKeyType="done"
      defaultValue={value}
      prependView={(
        <View style={styled.prepend}>
          {showNavAddrBook && (
            <>
              <TouchableOpacity onPress={onOpenAddressBook} {...generateTestId(SEND.ADDRESS_BOOK_ICON)}>
                <AddressBookIcon />
              </TouchableOpacity>
              <View style={styled.line} />
            </>
          )}
          <TouchableOpacity
            {...generateTestId(SEND.QR_CODE_ICON)}
            onPress={() => {
              openQrScanner(data => {
                let res = getAddress(data);
                input.onChange(res);
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
