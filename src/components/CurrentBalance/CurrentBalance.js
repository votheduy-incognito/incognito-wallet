import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import CryptoIcon from '@components/CryptoIcon/index';
import {generateTestId} from '@utils/misc';
import {SEND} from '@src/constants/elements';
import styles from './style';

const CurrentBalance = ({ amount, symbol, select, tokenId }) => (
  <View style={styles.container}>
    <Text style={styles.desc}>Current balance</Text>
    <View style={styles.balanceContainer}>
      <Text style={styles.balance} numberOfLines={1} ellipsizeMode='tail' {...generateTestId(SEND.BALANCE)}>{amount}</Text>
      <View style={select ? styles.selectContainer : null}>
        { select ? <CryptoIcon key={tokenId} tokenId={tokenId} size={22} /> : null }
        <Text {...generateTestId(SEND.TOKEN_SYMBOL)} style={[styles.balanceSymbol, select ? styles.selectText : null]} numberOfLines={1} ellipsizeMode='tail'>{symbol}</Text>
        { select ? select : null }
      </View>
    </View>
  </View>
);

CurrentBalance.defaultProps = {
  amount: null,
  symbol: null,
  select: null,
  tokenId: '',
};

CurrentBalance.propTypes = {
  amount: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  symbol: PropTypes.string,
  select: PropTypes.element,
  tokenId: PropTypes.string,
};

export default CurrentBalance;
