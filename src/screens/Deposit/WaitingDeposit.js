import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { waitingDepositStyle } from './style';

const WaitingDeposit = ({ selectedPrivacy, depositAddress }) => {
  return (
    <View style={waitingDepositStyle.container}>
      <View style={waitingDepositStyle.textContainer}>
        <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}>Please send {selectedPrivacy?.externalSymbol} to this address within the next 60 minutes.</Text>
        <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight, { marginBottom: 20 }]}>This address is unique to this deposit order, and can only be used once.</Text>
      </View>
      <QrCodeAddress data={depositAddress} />
      <Text style={[waitingDepositStyle.text, { marginTop: 50 }]}>Close this screen anytime. You&apos;ll receive a notification once your balance is updated.</Text>
      <Text style={[waitingDepositStyle.text]}>Need more time? Just create a new deposit order.</Text>
    </View>
  );
};

WaitingDeposit.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  depositAddress: PropTypes.string.isRequired,
};

export default WaitingDeposit;
