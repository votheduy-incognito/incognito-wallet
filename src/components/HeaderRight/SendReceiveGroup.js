import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity } from '@src/components/core';
import { withNavigation } from 'react-navigation';
import sendIcon from '@src/assets/images/icons/send.png';
import qrCodeIcon from '@src/assets/images/icons/qrCode.png';
import ROUTE_NAMES from '@src/router/routeNames';
import { sendReceiveGroupStyle } from './style';

const SendReceiveGroup = ({ navigation }) => {
  const goToSend = () => {
    navigation.navigate(ROUTE_NAMES.SendCrypto);
  };
  const goToReceive = () => {
    navigation.navigate(ROUTE_NAMES.ReceiveCrypto);
  };

  return (
    <View style={sendReceiveGroupStyle.container}>
      <TouchableOpacity onPress={goToReceive} style={sendReceiveGroupStyle.btn}>
        <Image source={qrCodeIcon} style={sendReceiveGroupStyle.image} />
      </TouchableOpacity>
      <TouchableOpacity onPress={goToSend} style={sendReceiveGroupStyle.btn}>
        <Image source={sendIcon} style={sendReceiveGroupStyle.image} />
      </TouchableOpacity>
    </View>
  );
};

SendReceiveGroup.propTypes = {
  navigation: PropTypes.object.isRequired
};

export default withNavigation(SendReceiveGroup);
