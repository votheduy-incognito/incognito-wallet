import React from 'react';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';

const WaitingDeposit = ({ depositAddress, amount }) => {
  return (
    <View>
      <Text>Please send {amount} to this address</Text>
      <Text>Timeout: 60 mins</Text>
      <QrCodeAddress data={depositAddress} />
    </View>
  );
};

export default WaitingDeposit;