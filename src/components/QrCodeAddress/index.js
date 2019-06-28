import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from '@src/components/core';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import CopiableText from '@src/components/CopiableText';
import accountAddressStyle from './style';

const AccountAddress = ({ data }) => (
  <View style={accountAddressStyle.container}>
    {
      data ? (
        <>
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
        </>
      ) : <ActivityIndicator />
    }
  </View>
);

AccountAddress.defaultProps = {
  data: ''
};

AccountAddress.propTypes = {
  data: PropTypes.string
};

export default AccountAddress;