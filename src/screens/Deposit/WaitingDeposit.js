import React from 'react';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';

const WaitingDeposit = ({ selectedPrivacy, depositAddress, amount }) => {
  return (
    <View>
      <Text style={{ textAlign: 'center', marginBottom: 30 }}>Please send {amount} {selectedPrivacy?.symbol} to this address within 60 minutes. After this, you can close this screen, we will let you know once completed.</Text>
      <QrCodeAddress data={depositAddress} />
    </View>
  );
};

export default WaitingDeposit;