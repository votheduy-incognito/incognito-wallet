import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import { accountBalanceStyle } from './style';

const AccountBalance = ({ balance = 0, isGettingBalance }) => (
  <View style={accountBalanceStyle.container}>
    {
      isGettingBalance ? <ActivityIndicator color='white' /> : (
        <>
          <Text style={accountBalanceStyle.textBalance}>{formatUtil.amount(balance)}</Text>
          <Text style={accountBalanceStyle.textSymbol}>{CONSTANT_COMMONS.CONST_SYMBOL}</Text>
        </>
      )
    }
  </View>
);

AccountBalance.propTypes = {
  balance: PropTypes.number,
  isGettingBalance: PropTypes.bool
};


export default AccountBalance;