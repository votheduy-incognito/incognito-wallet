import { Text, View } from '@components/core';
import PropTypes from 'prop-types';
import React from 'react';
import formatUtils from '@src/utils/format';
import { PRV } from '@src/services/wallet/tokenService';
import { PRVSymbol } from '@src/components';
import { rewardStyle } from './style';

const Reward = ({ symbol, pDecimals, balance, balanceStyle, containerItemStyle }) => (
  <View style={rewardStyle.container}>
    <View style={[{ flexDirection: 'row' }, containerItemStyle]}>
      {symbol === PRV?.symbol && <PRVSymbol style={[balanceStyle, rewardStyle.prvStyle]} />}
      <Text style={[rewardStyle.balance, balanceStyle, {fontVariant: ['tabular-nums']}]} numberOfLines={1}>
        {formatUtils.amountFull(balance, pDecimals, true)} {symbol === PRV?.symbol ? '' : symbol}
      </Text>
    </View>
  </View>
);


Reward.defaultProps = {
  pDecimals: 0,
  containerItemStyle: null,
  balanceStyle: null,
};

Reward.propTypes = {
  symbol: PropTypes.string.isRequired,
  balance: PropTypes.number.isRequired,
  pDecimals: PropTypes.number,
  containerItemStyle: PropTypes.object,
  balanceStyle: PropTypes.object,
};

export default React.memo(Reward);

