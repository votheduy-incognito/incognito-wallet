import React from 'react';
import {View} from '@components/core';
import SettingIcon from '@components/SettingIcon/index';
import AccountSelect from '@screens/Wallet/AccountSelect';
import styles from './style';

const withTopRoundHeaderLayout = WrappedComp => props => {
  return (
    <View style={styles.container}>
      <View style={styles.specialBg} />
      <View style={styles.header}>
        <View style={styles.account}>
          <AccountSelect />
        </View>
        <SettingIcon />
      </View>
      <View style={styles.content}>
        <WrappedComp {...props} />
      </View>
    </View>
  );
};


export default withTopRoundHeaderLayout;
