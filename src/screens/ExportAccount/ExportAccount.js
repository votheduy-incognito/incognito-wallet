import CopiableText from '@src/components/CopiableText';
import { Container, Text, View } from '@src/components/core';
import { COLORS } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import styleSheet from './style';

const ExportItem = ({ label, data, color }) => (
  <CopiableText style={styleSheet.itemContainer} text={data}>
    <View style={styleSheet.content}>
      <Text style={[styleSheet.itemLabel, { color }]}>{label}</Text>
      <Text numberOfLines={1} ellipsizeMode="middle" style={styleSheet.itemData}>
        {data}
      </Text>
    </View>
    <View style={styleSheet.rightBlock}>
      <Text style={styleSheet.copyText}>Copy</Text>
    </View>
  </CopiableText>
);

const ExportAccount = ({ account }) => (
  <View style={styleSheet.container}>
    <ExportItem
      label="YOUR INCOGNITO ADDRESS"
      data={account?.PaymentAddress}
    />
    <ExportItem
      label="PRIVATE KEY"
      data={account?.PrivateKey}
    />
    <ExportItem
      label="PUBLIC KEY"
      data={account?.PublicKeyCheckEncode}
    />
    <ExportItem
      label="READONLY KEY"
      data={account?.ReadonlyKey}
    />
  </View>
);

ExportAccount.propTypes = {
  account: PropTypes.object.isRequired
};

export default ExportAccount;
