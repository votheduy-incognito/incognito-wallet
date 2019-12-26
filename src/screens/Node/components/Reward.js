import { Text, View } from '@components/core';
import PropTypes from 'prop-types';
import React from 'react';
import CryptoIcon from '@components/CryptoIcon/index';
import formatUtils from '@src/utils/format';
import styles, { rewardStyle } from './style';

const Reward = ({ tokenId, symbol, pDecimals, balance }) => (
  <View style={rewardStyle.container}>
    <View style={styles.imageWrapper}>
      <CryptoIcon tokenId={tokenId} size={30} />
    </View>
    <View>
      <Text numberOfLines={1} style={rewardStyle.balance}>{formatUtils.amount(balance, pDecimals)} {symbol}</Text>
    </View>
  </View>
);


Reward.defaultProps = {
  pDecimals: 0,
};

Reward.propTypes = {
  tokenId: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  pDecimals: PropTypes.number,
};

export default React.memo(Reward);

