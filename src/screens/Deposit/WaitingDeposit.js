import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from '@src/components/core';
import QrCodeAddress from '@src/components/QrCodeAddress';
import { waitingDepositStyle } from './style';

const WaitingDeposit = ({ selectedPrivacy, depositAddress, min, max }) => {
  return (
    <View style={waitingDepositStyle.container}>
      <View style={waitingDepositStyle.textContainer}>
        <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}>Please send {selectedPrivacy?.externalSymbol} to this address within the next 60 minutes.</Text>
        <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}>This address is unique to this deposit order, and can only be used once.</Text>
        { min && <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight, { marginVertical: 10 }]}>The minimum deposit is {min} {selectedPrivacy?.externalSymbol}. Smaller amounts will not be processed.</Text> }
        { max && <Text style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight, { marginVertical: 10 }]}>The maximum deposit is {max} {selectedPrivacy?.externalSymbol}. Larger amounts will not be processed.</Text> }
      </View>
      <QrCodeAddress data={depositAddress} />
      <Text style={[waitingDepositStyle.text, { marginTop: 50 }]}>Close this screen anytime. You&apos;ll receive a notification once your balance is updated.</Text>
      <Text style={[waitingDepositStyle.text]}>Need more time? Just create a new deposit order.</Text>
    </View>
  );
};

WaitingDeposit.defaultProps = {
  min: null,
  max: null
};

WaitingDeposit.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  depositAddress: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number
};

export default WaitingDeposit;
