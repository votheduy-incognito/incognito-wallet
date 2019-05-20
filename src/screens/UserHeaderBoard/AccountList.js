import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, ActivityIndicator } from '@src/components/core';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import _ from 'lodash';
import formatUtil from '@src/utils/format';
import { accountListStyle } from './style';

const getAccountValue = value => value < 0 ? 'Select to load balance' : formatUtil.amountConstant(value);

const AccountItem = ({ account, onPress, active, isLoading }) => (
  <TouchableOpacity onPress={onPress} style={accountListStyle.accountItem}>
    <View style={accountListStyle.activeIconContainer}>
      { active && <OcticonsIcon name='primitive-dot' size={24} color='green' /> }
    </View>
    <View>
      <Text style={accountListStyle.accountItemLabel}>{account?.name}</Text>
      {
        isLoading ? <ActivityIndicator /> : <Text>{getAccountValue(account?.value)}</Text>
      }
    </View>
  </TouchableOpacity>
);

const AccountList = ({ accounts, switchAccount, defaultAccountName, isGettingBalance }) => {
  const sortedAccounts = _.sortBy(accounts, ['name']) || [];
  
  return (
    <View>
      {
        sortedAccounts.map((account, index) => {
          const handleSwitchAccount = () => switchAccount(account);
          return (
            <AccountItem
              key={index}
              account={account}
              onPress={handleSwitchAccount}
              active={account?.name === defaultAccountName}
              isLoading={isGettingBalance?.includes(account?.name)}
            />
          );
        })
      }
    </View>
  );
};

AccountList.propTypes = {
  accounts: PropTypes.array,
  switchAccount: PropTypes.func,
  defaultAccountName: PropTypes.string
};

AccountItem.propTypes = {
  onPress: PropTypes.func,
  account: PropTypes.object,
  active: PropTypes.bool
};

export default AccountList;