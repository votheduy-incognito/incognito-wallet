import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import {
  View,
  Text,
  RoundCornerButton,
  LoadingContainer,
  FlexView,
} from '@components/core';
import LoadingTx from '@components/LoadingTx';
import { ExHandler } from '@services/exception';
import { COINS, MESSAGES } from '@src/constants';
import Row from '@components/Row';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import accountService from '@services/wallet/accountService';
import convertUtil from '@utils/convert';
import withDefaultAccount from '@components/Hoc/withDefaultAccount';
import { withLayout_2 } from '@components/Layout';
import { Header, SuccessModal, Balance } from '@src/components';
import KeepAwake from 'react-native-keep-awake';
import formatUtil from '@utils/format';
import routeNames from '@routers/routeNames';
import styles from './style';

const BuyNodeFormScreen = (props) => {
  const orderId = useNavigationParam('orderId');
  const paymentAddress = useNavigationParam('paymentAddress');
  const rawAmount = useNavigationParam('amount');
  const coin = useNavigationParam('coin');
  const fee = useNavigationParam('fee');
  const prvBalance = useNavigationParam('prvBalance');
  const coinBalance = useNavigationParam('coinBalance');

  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState('');
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigation = useNavigation();

  const { account, wallet } = props;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let amount = rawAmount;

      if (fee.id === coin.tokenId) {
        amount += fee.value;
      }

      const displayAmount = formatUtil.amountFull(amount, coin.pDecimals);
      setAmount(amount);
      setDisplayAmount(displayAmount);
    } catch (e) {
      new ExHandler(e, 'Could not load data').showErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setSuccess(true);
  };

  const handleSend = async () => {
    let prvFee = 0;
    let tokenFee = 0;

    if (fee.id === COINS.PRV_ID) {
      prvFee = fee.value;
    } else {
      tokenFee = fee.value;
    }

    if (processing) {
      return;
    }

    setProcessing(true);
    setError('');

    try {
      if (coinBalance < amount + tokenFee) {
        return setError(MESSAGES.INSUFFICIENT_BALANCE);
      }

      if (prvBalance < prvFee) {
        return setError(MESSAGES.NOT_ENOUGH_NETWORK_FEE);
      }

      const result = await accountService.createAndSendToken(
        account,
        wallet,
        paymentAddress,
        amount,
        coin.tokenId,
        prvFee,
        tokenFee,
      );

      if (result && result.txId) {
        handleSuccess();
      }
    } catch (error) {
      setError(new ExHandler(error).getMessage());
    } finally {
      setProcessing(false);
    }
  };

  const closeSuccess = () => {
    setSuccess(false);
    navigation.navigate(routeNames.Node);
  };

  if (loading) {
    return <LoadingContainer />;
  }

  return (
    <FlexView>
      <Header title="Payment" />
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Amount payable</Text>
          <Row spaceBetween center>
            <Text style={styles.text}>{displayAmount}</Text>
            <Text style={styles.text}>{coin.symbol}</Text>
          </Row>
          {!!error && <Text style={styles.error}>{error}</Text>}
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.text}>{orderId}</Text>
        </View>
        <RoundCornerButton
          title="Buy now"
          style={styles.button}
          disabled={error}
          onPress={handleSend}
        />
        <Balance token={coin} balance={coinBalance} />
        { fee.id === COINS.PRV_ID && coin.tokenId !== COINS.PRV_ID && (
          <Balance token={COINS.PRV} balance={prvBalance} />
        )}
        <Balance token={fee.coin} balance={fee.value} title="Network fee" />
      </View>
      {processing && <LoadingTx />}
      <SuccessModal
        title="Payment successful."
        extraInfo="You’ll receive an order confirmation within 24 hours."
        visible={success}
        closeSuccessDialog={closeSuccess}
        buttonStyle={styles.buttonColor}
      />
      <KeepAwake />
    </FlexView>
  );
};

BuyNodeFormScreen.propTypes = {
  account: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
};

export default compose(
  withLayout_2,
  withDefaultAccount,
)(BuyNodeFormScreen);
