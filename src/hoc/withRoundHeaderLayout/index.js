import React from 'react';
import { View } from '@components/core';
import SettingIcon from '@components/SettingIcon/index';
import AccountSelect from '@screens/Wallet/AccountSelect';
import { NotificationIcon } from '@src/components/Icons';
import { useSelector } from 'react-redux';
import { dataNotificationsSelector } from '@src/screens/Notification/Notification.selector';
import withFCM from '@src/screens/Notification/Notification.withFCM';
import { compose } from 'recompose';
import styles from './style';

const withTopRoundHeaderLayout = WrappedComp => props => {
  const { isReadAll } = useSelector(dataNotificationsSelector);
  return (
    <View style={styles.container}>
      <View style={styles.specialBg} />
      <View style={styles.header}>
        <AccountSelect />
        <NotificationIcon isReadAll={isReadAll} />
        <SettingIcon />
      </View>
      <View style={styles.content}>
        <WrappedComp {...props} />
      </View>
    </View>
  );
};

export default compose(withFCM, withTopRoundHeaderLayout);
