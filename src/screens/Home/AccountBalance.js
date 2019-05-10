import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ActivityIndicator } from '@src/components/core';
import MdIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { CONSTANT_COMMONS } from '@src/constants';
import formatUtil from '@src/utils/format';
import convertUtil from '@src/utils/convert';
import { accountBalanceStyle } from './style';

const AccountBalance = ({ balance = 0, isGettingBalance, onReload }) => (
  <View style={accountBalanceStyle.container}>
    {
      isGettingBalance ? <ActivityIndicator color='white' /> : (
        <>
          <Text style={accountBalanceStyle.textBalance}>{formatUtil.amountConstant(convertUtil.toConstant(balance))}</Text>
          <Text style={accountBalanceStyle.textSymbol}>{CONSTANT_COMMONS.CONST_SYMBOL}</Text>
          <MdIcons.Button name='reload' onPress={onReload} color='yellow' />
        </>
      )
    }
  </View>
);

AccountBalance.propTypes = {
  balance: PropTypes.number,
  isGettingBalance: PropTypes.bool,
  onReload: PropTypes.func
};


export default AccountBalance;