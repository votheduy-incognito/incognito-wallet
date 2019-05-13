import React from 'react';
import PropTypes from 'prop-types';
import { Text, Container, View } from '@src/components/core';
import CopiableText from '@src/components/CopiableText';
import { COLORS } from '@src/styles';
import styleSheet from './style';


const ExportItem = ({ label, data, color }) => (
  <CopiableText style={styleSheet.itemContainer} text={data}>
    <View style={styleSheet.content}>
      <Text style={[styleSheet.itemLabel, { color }]}>{label}</Text>
      <Text numberOfLines={1} ellipsizeMode='middle'>{data}</Text>
    </View>
  </CopiableText>
);

const ExportAccount = ({ account }) => (
  <Container style={styleSheet.container}>
    <ExportItem label='READONLY KEY' data={account?.ReadonlyKey} color={COLORS.blue} />
    <ExportItem label='PRIVATE KEY' data={account?.PrivateKey} color={COLORS.red} />
    <ExportItem label='PUBLIC KEY IN HEX' data={account?.PublicKey} color={COLORS.orange} />
    <ExportItem label='PUBLIC KEY BASE58 CHECK ENCODE' data={account?.PublicKeyCheckEncode} color={COLORS.green} />
    <ExportItem label='PUBLIC KEY BYTES' data={account?.PublicKeyBytes} color={COLORS.purple} />
  </Container>
);


ExportAccount.propTypes = {
  account: PropTypes.object
};

export default ExportAccount;