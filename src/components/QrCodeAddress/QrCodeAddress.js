import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator } from '@src/components/core';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import CopiableText from '@src/components/CopiableText';
import accountAddressStyle from './style';

const AccountAddress = ({ data, containerStyle, textStyle, iconStyle }) => (
  <View style={accountAddressStyle.container}>
    {
      data ? (
        <>
          <QrCodeGenerate value={data} style={accountAddressStyle.qrCode} size={100} />
          <CopiableText
            oneLine
            showCopyIcon
            containerProps={{
              style : [accountAddressStyle.textBox, containerStyle]
            }}
            textProps={{
              style: [accountAddressStyle.text, textStyle],
              numberOfLines: 1,
              ellipsizeMode:'middle'
            }}
            iconStyle={iconStyle}
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
