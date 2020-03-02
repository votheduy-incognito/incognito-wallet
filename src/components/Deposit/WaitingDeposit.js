import React from 'react';
import PropTypes from 'prop-types';
import {Button, Text, View} from '@components/core/';
import QrCodeAddress from '@components/QrCodeAddress/';
import format from '@utils/format';
import {Dashed} from '@components/Line/';
import {useNavigation} from 'react-navigation-hooks';
import ROUTES_NAME from '@routers/routeNames';
import {waitingDepositStyle} from './style';

const WaitingDeposit = ({selectedPrivacy, depositAddress, min, max, amount}) => {
  const navigation = useNavigation();
  const formatAmount = format.amountFull(amount);
  const {externalSymbol, symbol} = selectedPrivacy;

  const handleCheckStatus = () => {
    navigation.pop();
    navigation.navigate(ROUTES_NAME.WalletDetail);
  };

  return (
    <View style={waitingDepositStyle.container}>
      <View style={waitingDepositStyle.textContainer}>
        <Text
          style={[waitingDepositStyle.text, waitingDepositStyle.textHighlight]}
        >
          {
            formatAmount ?
              `Shield ${formatAmount} ${externalSymbol} by sending it to the address below within 60 MINUTES ONLY:`
              : `Receive ${externalSymbol} privately from outside the Incognito network using the address below within 60 MINUTES ONLY:`
          }
        </Text>
        <Dashed />
        {!!min && (
          <Text style={[waitingDepositStyle.text]}>
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
        {!!max && (
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
        { (min || max) ? <Dashed /> : null }
      </View>
      <QrCodeAddress data={depositAddress} />
      <Button
        onPress={handleCheckStatus}
        title="Check transaction status"
        style={waitingDepositStyle.btn}
      />
      <Dashed />
      <Text style={[waitingDepositStyle.text]}>
        {`You'll receive ${formatAmount} privacy ${externalSymbol} (${symbol}) in your Incognito wallet a few minutes after your transfer is complete.`}
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
