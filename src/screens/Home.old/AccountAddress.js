import React from 'react';
import PropTypes from 'prop-types';
import { View } from '@src/components/core';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import CopiableText from '@src/components/CopiableText';
import { accountAddressStyle } from './style';

const AccountAddress = ({ data }) => (
  <View style={accountAddressStyle.container}>
    <QrCodeGenerate value={data} style={accountAddressStyle.qrCode} size={150} />
    <CopiableText
      oneLine
      containerProps={{
        style :accountAddressStyle.textBox
      }}
      textProps={{
        style: accountAddressStyle.text,
        numberOfLines: 1,
        ellipsizeMode:'middle'
      }}
      text={data}
    />
  </View>
);

AccountAddress.propTypes = {
  data: PropTypes.string
};

export default AccountAddress;