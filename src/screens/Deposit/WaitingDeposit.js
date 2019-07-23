import React from 'react';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';

const WaitingDeposit = ({ selectedPrivacy, depositAddress, amount }) => {
  return (
    <View>
      <Text style={{ textAlign: 'center', marginBottom: 30 }}>Please send {amount} {selectedPrivacy?.symbol} to this address within 60 minutes</Text>
      <QrCodeAddress data={depositAddress} />
    </View>
  );
};

export default WaitingDeposit;