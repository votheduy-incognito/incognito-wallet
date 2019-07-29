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
      <Text numberOfLines={1} ellipsizeMode="middle">
        {data}
      </Text>
    </View>
  </CopiableText>
);

const ExportAccount = ({ account }) => (
  <Container style={styleSheet.container}>
    <ExportItem
      label="READONLY KEY"
      data={account?.ReadonlyKey}
      color={COLORS.blue}
    />
    <ExportItem
      label="PRIVATE KEY"
      data={account?.PrivateKey}
      color={COLORS.red}
    />
    <ExportItem
      label="PUBLIC KEY IN HEX"
      data={account?.PublicKey}
      color={COLORS.orange}
    />
    <ExportItem
      label="PUBLIC KEY BASE58 CHECK ENCODE"
      data={account?.PublicKeyCheckEncode}
      color={COLORS.green}
    />
    <ExportItem
      label="PUBLIC KEY BYTES"
      data={account?.PublicKeyBytes}
      color={COLORS.green}
    />
  </Container>
);

ExportAccount.propTypes = {
  account: PropTypes.object.isRequired
};

export default ExportAccount;
