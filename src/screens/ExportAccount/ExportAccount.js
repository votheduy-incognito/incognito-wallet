import CopiableText from '@src/components/CopiableText';
import { ScrollView, Text, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import clipboard from '@src/services/clipboard';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import styleSheet from './style';


const ExportItem = ({ label, data, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styleSheet.itemContainer}>
    <View style={styleSheet.content}>
      <Text style={[styleSheet.itemLabel]}>{label}</Text>
      <Text numberOfLines={1} ellipsizeMode="middle" style={styleSheet.itemData}>
        {data}
      </Text>
    </View>
    <CopiableText showCopyIcon onPress={() => { clipboard.set(data, { copiedMessage: `${label} was copied.` }); }} style={styleSheet.copiableIco} />
  </TouchableOpacity>
);


const ExportAccount = ({ account, token }) => {
  const [isShowQRCodeKey, setShowQRCodeKey] = useState(false);
  const [itemQRCode, setItemQRCode] = useState('');
  const [lableQRCode, setLableQRCode] = useState('');

  const parseShard = (bytes) => {
    const arr = bytes.split(',');
    const lastByte = arr[arr.length - 1];
    return (lastByte % 8).toString();
  };
  const renderQRCode = () => {
    let data = itemQRCode && typeof itemQRCode === 'string' && itemQRCode || '';
    let title = lableQRCode && lableQRCode || '';
    return (
      <Modal
        transparent
        animated
        animationType="bounceIn"
        visible={isShowQRCodeKey}
        onRequestClose={() => {
          console.log('close modal');
          setShowQRCodeKey(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => { setShowQRCodeKey(false); }} style={styleSheet.modalContainer}>
          <View style={styleSheet.modalBackground}>
            <View style={styleSheet.modalContent}>
              <Text style={[styleSheet.itemLabel, styleSheet.title]}>{title}</Text>
              <QrCodeGenerate value={data} size={100} />
              <CopiableText
                oneLine
                showCopyIcon
                containerProps={{
                  style: [styleSheet.textBox]
                }}
                textProps={{
                  numberOfLines: 1,
                  ellipsizeMode: 'middle'
                }}
                text={data}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  };

  const renderItem = (label, value) => (
    value
      ? (
        <ExportItem
          label={label}
          data={value}
          onPress={() => {
            setItemQRCode(value);
            setLableQRCode(label);
            setShowQRCodeKey(true);
          }}
        />
      )
      : null
  );

  return (
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
      {renderQRCode()}
    </ScrollView>
  );
};

ExportAccount.defaultProps = {
  token: '',
};

ExportAccount.propTypes = {
  account: PropTypes.object.isRequired,
  token: PropTypes.string,
};

ExportItem.propTypes = {
  label: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

export default ExportAccount;
