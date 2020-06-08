import CopiableText from '@src/components/CopiableText';
import { ScrollView, Text, View } from '@src/components/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import clipboard from '@src/services/clipboard';
import QrCodeGenerate from '@src/components/QrCodeGenerate';
import { BtnQRCode } from '@src/components/Button';
import { Icon } from 'react-native-elements';
import { COLORS } from '@src/styles';
import styleSheet from './style';


const ExportItem = ({ label, data, onPress, onPressQRCode }) => (
  <View onPress={onPress} style={styleSheet.itemContainer}>
    <View style={styleSheet.content}>
      <Text style={[styleSheet.itemLabel]}>{label}</Text>
      <Text numberOfLines={1} ellipsizeMode="middle" style={styleSheet.itemData}>
        {data}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingEnd: 10 }}>
      <BtnQRCode onPress={onPressQRCode} style={{ paddingEnd: 5 }} />
      <TouchableOpacity onPress={onPress}>
        <Icon type='material' name="content-copy" size={25} style={[styleSheet.copyIcon]} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
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
          onPressQRCode={() => {
            setItemQRCode(value);
            setLableQRCode(label);
            setShowQRCodeKey(true);
          }}
          onPress={() => {
            clipboard.set(value, { copiedMessage: `${label} was copied.` });
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
        {(__DEV__ || global.isDEV) ? renderItem('BLS KEY', account?.ValidatorKey) : null}
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
  onPress: PropTypes.func.isRequired,
  onPressQRCode: PropTypes.func.isRequired,
};

export default ExportAccount;
