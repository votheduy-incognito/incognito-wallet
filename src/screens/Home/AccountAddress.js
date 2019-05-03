import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from '@src/components/core';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import clipboard from '@src/services/clipboard';
import { accountAddressStyle } from './style';

const AccountAddress = ({ data }) => (
  <View style={accountAddressStyle.container}>
    <QrCodeGenerate data={data} style={accountAddressStyle.qrCode} size={150} />
    <TouchableOpacity style={accountAddressStyle.textBox} onPress={() => clipboard.set(data)} >
      <Text style={accountAddressStyle.text} numberOfLines={1} ellipsizeMode='middle' >{data}</Text>
      <MdIcons name='content-copy' size={20} style={accountAddressStyle.copyIcon} />
    </TouchableOpacity>
  </View>
);

AccountAddress.propTypes = {
  data: PropTypes.string
};

export default AccountAddress;