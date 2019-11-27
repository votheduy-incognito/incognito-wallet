import { Alert, Divider, Text, Toast, TouchableOpacity, View } from '@src/components/core';
import OptionMenu from '@src/components/OptionMenu';
import { removeAccount, switchAccount } from '@src/redux/actions/account';
import { accountSeleclor } from '@src/redux/selectors';
import ROUTE_NAMES from '@src/router/routeNames';
import { ExHandler } from '@src/services/exception';
import { COLORS } from '@src/styles';
import { onClickView } from '@src/utils/ViewUtil';
import dexUtils from '@src/utils/dex';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'react-native-elements';
import Swipeout from 'react-native-swipeout';
import Icons from 'react-native-vector-icons/Entypo';
import FIcons from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import Section from './Section';
import { accountSection } from './style';

let lastAccount;
let clickedTime = 0;

function isDev(account) {
  if (lastAccount !== account) {
    clickedTime = 0;
  }
  lastAccount = account;
  clickedTime++;

  if (clickedTime === 7) {
    global.isDEV = true;
  }
}

const createItem = (account, onSwitch, onExport, onDelete, isActive) => (
  <Swipeout
    style={accountSection.swipeoutButton}
    right={[
      ...onDelete ? [{ text: 'Delete', backgroundColor: COLORS.red, onPress: () => onDelete(account) }] : []
    ]}
  >
    <View style={accountSection.container}>
      <TouchableOpacity style={accountSection.name} onPress={() => onSwitch(account) && isDev(account)}>
        <View style={[accountSection.indicator, isActive && accountSection.indicatorActive]} />
        <FIcons name={isActive ? 'user-check' : 'user'} size={20} color={isActive ? COLORS.primary : COLORS.lightGrey4} />
        <Text numberOfLines={1} ellipsizeMode='middle' style={isActive ? accountSection.nameTextActive : accountSection.nameText}>{account?.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={accountSection.actionBtn} onPress={() => onExport(account)}>
        <Icons name='key' size={20} color={COLORS.lightGrey3} />
      </TouchableOpacity>
    </View>
  </Swipeout>
);


const AccountSection = ({ navigation, defaultAccount, listAccount, removeAccount, switchAccount }) => {
  const onHandleSwitchAccount = onClickView(async account => {
    try {
      if (defaultAccount?.name === account?.name) {
        Toast.showInfo(`Your current account is "${account?.name}"`);
        return;
      }

      await switchAccount(account?.name);

      Toast.showInfo(`Switched to account "${account?.name}"`);
    } catch (e) {
      new ExHandler(e, `Can not switch to account "${account?.name}", please try again.`).showErrorToast();
    }
  });

  const handleExportKey = account => {
    navigation.navigate(ROUTE_NAMES.ExportAccount, { account });
  };

  const handleImport = () => {
    navigation.navigate(ROUTE_NAMES.ImportAccount, { onSwitchAccount: onHandleSwitchAccount });
  };

  const handleCreate = () => {
    navigation.navigate(ROUTE_NAMES.CreateAccount, { onSwitchAccount: onHandleSwitchAccount });
  };

  const handleDelete = account => {
    Alert.alert(
      `Delete account "${account?.name}"?`,
      'Do you want to delete this account?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'OK, delete it',
          onPress: async () => {
            try {
              await removeAccount(account);
              Toast.showSuccess('Account removed.');
            } catch (e) {
              new ExHandler(e, `Can not delete account ${account?.name}, please try again.`).showErrorToast();
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const menu = [
    {
      id: 'import',
      icon: <Icon type='material' name="input" size={25} />,
      desc: 'Import an existing account',
      label: 'Import',
      handlePress: handleImport
    },
    {
      id: 'create',
      icon: <Icon type='material' name="add" size={25} />,
      desc: 'Create a new account',
      label: 'Create',
      handlePress: handleCreate
    }
  ];

  const isDeletable = (account) => listAccount.length > 1 && !dexUtils.isDEXAccount(account?.name);

  return (
    <Section
      label='Your accounts'
      headerRight={(
        <OptionMenu data={menu} icon={<Icons name='dots-three-horizontal' size={20} style={{ color: COLORS.lightGrey1 }} />} style={accountSection.optionMenu} />
      )}
      customItems={
        listAccount?.map((account, index) => (
          <View key={account?.name} style={accountSection.itemWrapper}>
            {
              account?.name
                && createItem(
                  account,
                  onHandleSwitchAccount,
                  handleExportKey,
                  isDeletable(account) ? handleDelete : null,
                  account?.name === defaultAccount?.name
                )
            }
            { (index === listAccount.length - 1) && <Divider height={1} color={COLORS.lightGrey5} /> }
          </View>
        ))
      }
    />
  );
};

AccountSection.propTypes = {
  navigation: PropTypes.object.isRequired,
  defaultAccount: PropTypes.object.isRequired,
  listAccount: PropTypes.arrayOf(PropTypes.object).isRequired,
  switchAccount: PropTypes.func.isRequired,
  removeAccount: PropTypes.func.isRequired,
};

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
  listAccount: accountSeleclor.listAccount(state)
});

const mapDispatch = { removeAccount, switchAccount };

export default connect(mapState, mapDispatch)(AccountSection);
