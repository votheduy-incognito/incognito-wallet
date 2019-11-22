import React from 'react';
import { View, Text } from '@components/core';
import { WithdrawHistory } from '@models/dexHistory';
import formatUtils from '@utils/format';
import stylesheet from './style';

export const WithdrawalInProgress = () => {

  if (!WithdrawHistory.currentWithdraw) {
    return null;
  }

  const { amount, account, tokenSymbol, pDecimals, checking } = WithdrawHistory.currentWithdraw;

  return (
    <View style={stylesheet.wrapper}>
      <Text numberOfLines={1} style={stylesheet.amount}>Withdrawing {formatUtils.amountFull(amount, pDecimals)} {tokenSymbol} to {account} {checking ? '[1]' : ''}</Text>
    </View>
  );
};
