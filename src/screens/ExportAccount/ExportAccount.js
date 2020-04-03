import CopiableText from '@src/components/CopiableText';
import { ScrollView, Text, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React from 'react';
import styleSheet from './style';

const ExportItem = ({ label, data }) => (
  <CopiableText style={styleSheet.itemContainer} text={data} copiedMessage={`${label} was copied.`}>
    <View style={styleSheet.content}>
      <Text style={[styleSheet.itemLabel]}>{label}</Text>
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

const parseShard = (bytes) => {
  const arr = bytes.split(',');
  const lastByte = arr[arr.length - 1];
  return (lastByte % 8).toString();
};

const ExportAccount = ({account, token}) => (
  <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
    <View style={styleSheet.container}>
      {renderItem('YOUR INCOGNITO ADDRESS', account?.PaymentAddress)}
      {renderItem('PRIVATE KEY', account?.PrivateKey)}
      {renderItem('PUBLIC KEY', account?.PublicKeyCheckEncode)}
      {renderItem('READONLY KEY', account?.ReadonlyKey)}
      {renderItem('VALIDATOR KEY', account?.ValidatorKey)}
      {(__DEV__ || global.isDEV) ? renderItem('DEVICE TOKEN', token) : null}
      {(__DEV__ || global.isDEV) ? renderItem('Shard', parseShard(account?.PublicKeyBytes)) : null}
    </View>
  </ScrollView>
);

ExportAccount.defaultProps = {
  token: ''
};

ExportAccount.propTypes = {
  account: PropTypes.object.isRequired,
  token: PropTypes.string,
};

ExportItem.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
};

export default ExportAccount;
