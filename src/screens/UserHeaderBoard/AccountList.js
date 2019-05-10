import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from '@src/components/core';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import _ from 'lodash';
import { accountListStyle } from './style';

const AccountItem = ({ account, onPress, active }) => (
  <TouchableOpacity onPress={onPress} style={accountListStyle.accountItem}>
    <View style={accountListStyle.activeIconContainer}>
      { active && <OcticonsIcon name='primitive-dot' size={24} color='green' /> }
    </View>
    <View>
      <Text style={accountListStyle.accountItemLabel}>{account?.name}</Text>
      <Text>{account?.value}</Text>
    </View>
  </TouchableOpacity>
);

const AccountList = ({ accounts, switchAccount, defaultAccountName }) => {
  const sortedAccounts = _.sortBy(accounts, ['name']) || [];
  return (
    <View>
      {
        sortedAccounts.map((account, index) => <AccountItem key={index} account={account} onPress={() => switchAccount(account)} active={account?.name === defaultAccountName} />)
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