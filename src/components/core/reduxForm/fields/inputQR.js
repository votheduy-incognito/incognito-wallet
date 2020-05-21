import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, View } from '@src/components/core';
import { openQrScanner } from '@src/components/QrCodeScanner';
import { AddressBookIcon } from '@src/components/Icons';
import { generateTestId } from '@utils/misc';
import { SEND } from '@src/constants/elements';
import { BtnQRCode } from '@src/components/Button';
import createField from './createField';

const styled = StyleSheet.create({
  prepend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  line: {
    width: 1,
    height: 20,
    backgroundColor: 'transparent',
    marginHorizontal: 10,
  },
});

const getAddress = text => {
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
      onChangeText={t => input.onChange(t)}
      onBlur={onBlur}
      onFocus={onFocus}
      returnKeyType="done"
      defaultValue={value}
      prependView={(
        <View style={styled.prepend}>
          {showNavAddrBook && (
            <>
              <TouchableOpacity
                onPress={onOpenAddressBook}
                {...generateTestId(SEND.ADDRESS_BOOK_ICON)}
              >
                <AddressBookIcon />
              </TouchableOpacity>
              <View style={styled.line} />
            </>
          )}
          <BtnQRCode
            onPress={() => {
              openQrScanner(data => {
                let res = getAddress(data);
                input.onChange(res);
              });
            }}
          />
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
