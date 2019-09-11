import CopiableText from '@src/components/CopiableText';
import { ScrollView, Text, View } from '@src/components/core';
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

const renderItem = (label, value) => (
  value
    ? (
      <ExportItem
        label={label}
        data={value}
      />
    )
    : null
);

const ExportAccount = ({ account }) => (
  <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
    <View style={styleSheet.container}>
      {renderItem('YOUR INCOGNITO ADDRESS', account?.PaymentAddress)}
      {renderItem('PRIVATE KEY', account?.PrivateKey)}
      {renderItem('PUBLIC KEY', account?.PublicKeyCheckEncode)}
      {renderItem('READONLY KEY', account?.ReadonlyKey)}
      {renderItem('VALIDATOR KEY', 'bls:' + account?.BlockProducerKey)}
    </View>
  </ScrollView>
);

ExportAccount.propTypes = {
  account: PropTypes.object.isRequired
};

ExportItem.defaultProps = {
  color: null
};

ExportItem.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  color: PropTypes.string,
};

export default ExportAccount;
