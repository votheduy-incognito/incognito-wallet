import React from 'react';
import PropTypes from 'prop-types';
import { View, Text } from '@src/components/core';
import { CONSTANT_COMMONS } from '@src/constants';
import { accountBalanceStyle } from './style';

const AccountBalance = ({ balance = 0 }) => (
  <View style={accountBalanceStyle.container}>
    <Text style={accountBalanceStyle.textBalance}>{balance}</Text>
    <Text style={accountBalanceStyle.textSymbol}>{CONSTANT_COMMONS.CONST_SYMBOL}</Text>
  </View>
);

AccountBalance.propTypes = {
  balance: PropTypes.number
};


export default AccountBalance;