import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { waitingDepositStyle } from './style';

const WaitingDeposit = ({ selectedPrivacy, depositAddress, amount }) => {
  return (
    <View style={waitingDepositStyle.container}>
      <View style={waitingDepositStyle.textContainer}>
        <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}>Please send {amount} {selectedPrivacy?.externalSymbol} to this address within the next 60 minutes.</Text>
        <Text style={waitingDepositStyle.text}>You can close this screen anytime. You&apos;ll receive a notification once your wallet balance has been updated.</Text>
        <Text style={waitingDepositStyle.text}>Ran out of time? Just create a new deposit order.</Text>
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