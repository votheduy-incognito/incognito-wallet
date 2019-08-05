import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { waitingDepositStyle } from './style';

const WaitingDeposit = ({ selectedPrivacy, depositAddress, amount }) => {
  return (
    <View style={waitingDepositStyle.container}>
      <View style={waitingDepositStyle.textContainer}>
        <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}>Please send {amount} {selectedPrivacy?.symbol} to this address within 60 minutes.</Text>
        <Text style={waitingDepositStyle.text}>After this, you can close this screen, we will let you know once completed.</Text>
      </View>
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