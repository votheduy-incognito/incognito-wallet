import { Text, View } from '@components/core';
import PropTypes from 'prop-types';
import React from 'react';
import CryptoIcon from '@components/CryptoIcon/index';
import formatUtils from '@src/utils/format';
import VerifiedText from '@components/VerifiedText/index';
import styles, { rewardStyle } from './style';

const Reward = ({ tokenId, symbol, pDecimals, balance, isVerified }) => (
  <View style={rewardStyle.container}>
    <View style={styles.imageWrapper}>
      <CryptoIcon tokenId={tokenId} size={30} />
    </View>
    <View style={rewardStyle.row}>
      <Text style={rewardStyle.balance} numberOfLines={1}>
        {formatUtils.amount(balance, pDecimals)} {symbol}
      </Text>
      <VerifiedText
        style={rewardStyle.balance}
        text=" "
        isVerified={isVerified}
      />
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
  isVerified: PropTypes.bool.isRequired,
};

export default React.memo(Reward);

