import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from '@components/core/';
import QrCodeAddress from '@components/QrCodeAddress/';
import format from '@utils/format';
import {Dashed} from '@components/Line/';
import {waitingDepositStyle} from './style';

const WaitingDeposit = ({selectedPrivacy, depositAddress, min, max, amount}) => {
  const formatAmount = format.amountFull(amount);
  const {symbol, externalSymbol} = selectedPrivacy;

  return (
    <View style={waitingDepositStyle.container}>
      <View style={waitingDepositStyle.textContainer}>
        <Text
          style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}
        >
          {
            formatAmount ?
              `Send ${formatAmount} ${externalSymbol} to the address below to receive ${formatAmount} privacy ${externalSymbol} (${symbol}) in your Incognito wallet.`
              : `Send ${externalSymbol} to the address below to receive privacy ${externalSymbol} (${symbol}) in your Incognito wallet.`
          }
        </Text>
        <Dashed />
        {min && (
          <Text style={[waitingDepositStyle.text, {marginVertical: 10}]}>
            The minimum deposit is
            <Text
              style={[
                waitingDepositStyle.text,
                waitingDepositStyle.textHighlight,
              ]}
            >
              {` ${min} ${selectedPrivacy?.externalSymbol}. `}
            </Text>
            Smaller amounts will not be processed.
          </Text>
        )}
        {max && (
          <Text style={[waitingDepositStyle.text, {marginVertical: 10}]}>
            The maximum deposit is
            <Text
              style={[
                waitingDepositStyle.text,
                waitingDepositStyle.textHighlight,
              ]}
            >
              {` ${max} ${selectedPrivacy?.externalSymbol}. `}
            </Text>
            Larger amounts will not be processed.
          </Text>
        )}
      </View>
      <QrCodeAddress data={depositAddress} />
      <Text style={[waitingDepositStyle.text]}>
        This address will expire in
        <Text
          style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}
        >
          &nbsp;60 minutes&nbsp;
        </Text>
        and can only be used once.
      </Text>
    </View>
  );
};

WaitingDeposit.defaultProps = {
  min: null,
  max: null,
  amount: 0,
};

WaitingDeposit.propTypes = {
  selectedPrivacy: PropTypes.object.isRequired,
  depositAddress: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  amount: PropTypes.number,
};

export default WaitingDeposit;
