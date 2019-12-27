import React from 'react';
import PropTypes from 'prop-types';
import {Button, Text, View} from '@components/core';
import formatUtils from '@utils/format';
import LoadingTx from '@components/LoadingTx/LoadingTx';
import {CONSTANT_COMMONS} from '@src/constants';
import {MESSAGES} from '@screens/Dex/constants';
import styles from './styles';

export const TAG = 'Unstake';

const pDecimals = CONSTANT_COMMONS.DECIMALS.MAIN_CRYPTO_CURRENCY;
const symbol = CONSTANT_COMMONS.CRYPTO_SYMBOL.PRV;

const Unstake = ({ device, fee, isUnstaking, balance, onUnstake }) => {
  const account = device.Account;
  const name = device.Name;
  const isNotEnoughBalance = fee > balance;
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>Node {name}</Text>
          <Text style={styles.title}>Account {account.AccountName}</Text>
          <View style={styles.row}>
            <Text style={styles.field}>Balance:</Text>
            <Text style={styles.itemRight}>{formatUtils.amount(balance, pDecimals)} {symbol}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.field}>Fee</Text>
            <Text style={styles.itemRight}>{formatUtils.amount(fee, pDecimals)} {symbol}</Text>
          </View>
        </View>
        <View style={styles.buy}>
          <Text style={[styles.desc, styles.firstLine]}>Unstaking will take approximately 48 hours.</Text>
          <Text style={styles.desc}>Are you sure you want to unstake this node?</Text>
          <Button disabled={isNotEnoughBalance} style={styles.button} title="Unstake" onPress={onUnstake} />
          {isNotEnoughBalance && <Text style={styles.error}>{MESSAGES.NOT_ENOUGH_NETWORK_FEE_ADD}</Text>}
        </View>
        { isUnstaking && <LoadingTx /> }
      </View>
    </View>
  );
};

Unstake.propTypes = {
  device: PropTypes.object.isRequired,
  fee: PropTypes.number.isRequired,
  isUnstaking: PropTypes.bool.isRequired,
  balance: PropTypes.number.isRequired,
  onUnstake: PropTypes.func.isRequired,
};

Unstake.defaultProps = {};

export default Unstake;
