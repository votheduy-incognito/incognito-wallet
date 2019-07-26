import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { waitingDepositStyle } from './style';

const WaitingDeposit = ({ selectedPrivacy, depositAddress, amount }) => {
  return (
    <View style={waitingDepositStyle.container}>
      <Text style={{ textAlign: 'center', marginBottom: 30 }}>Please send {amount} {selectedPrivacy?.symbol} to this address within 60 minutes. After this, you can close this screen, we will let you know once completed.</Text>
      <QrCodeAddress data={depositAddress} />
    </View>
  );
};

WaitingDeposit.defaultProps = {
  amount: 0
};

WaitingDeposit.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  depositAddress: PropTypes.string.isRequired,
  amount: PropTypes.oneOfType([ PropTypes.string, PropTypes.number])
};

export default WaitingDeposit;