import React from 'react';
import PropTypes from 'prop-types';
import {Button, Text, View} from '@components/core/';
import QrCodeAddress from '@components/QrCodeAddress/';
import format from '@utils/format';
import {Dashed} from '@components/Line/';
import {useNavigation} from 'react-navigation-hooks';
import ROUTES_NAME from '@routers/routeNames';
import {waitingDepositStyle} from './style';

const WaitingDeposit = ({selectedPrivacy, depositAddress, min, amount}) => {
  const navigation = useNavigation();
  const formatAmount = format.amountFull(amount);
  const {externalSymbol} = selectedPrivacy;

  const thisRoute = navigation?.state?.routeName;

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
            thisRoute === ROUTES_NAME.ReceiveCoin ?
              `Receive ${externalSymbol} anonymously from outside \nthe Incognito network using the address below:`
              : `Shield ${externalSymbol} from prying eyes \nby sending it to the address below:`
          }
        </Text>
        <Dashed />
      </View>
      <QrCodeAddress data={depositAddress} />
      <Text style={waitingDepositStyle.text}>
        Note: This address is unique to this request, will expire in 60 minutes, and can only be used once.
      </Text>
      <Button
        onPress={handleCheckStatus}
        title="Check transaction details"
        style={waitingDepositStyle.btn}
      />
      <Dashed />
      <Text style={waitingDepositStyle.text}>
        Please wait a few minutes for your anonymized coins to show in your wallet.
      </Text>
      { (min) ? <Dashed /> : null }
      {!!min && (
        <Text style={[waitingDepositStyle.text]}>
          {`The minimum amount you can anonymously receive from outside the Incognito network is ${min}. Smaller amounts will not be processed.`}
        </Text>
      )}
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
