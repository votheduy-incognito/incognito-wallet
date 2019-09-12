import { Alert, Divider, Text, Toast, TouchableOpacity, View } from '@src/components/core';
import OptionMenu from '@src/components/OptionMenu';
import { getBalance as getAccountBalance, reloadAccountFollowingToken, removeAccount, setDefaultAccount } from '@src/redux/actions/account';
import { accountSeleclor } from '@src/redux/selectors';
import ROUTE_NAMES from '@src/router/routeNames';
import { COLORS } from '@src/styles';
import { onClickView } from '@src/utils/ViewUtil';
import PropTypes from 'prop-types';
import React from 'react';
import Swipeout from 'react-native-swipeout';
import Icons from 'react-native-vector-icons/Entypo';
import FIcons from 'react-native-vector-icons/Feather';
import MdIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import Section from './Section';
import { accountSection } from './style';

const createItem = (account, onSwitch, onExport, onDelete, isActive) => (
  <Swipeout
    style={accountSection.swipeoutButton}
    right={[
      ...onDelete ? [{ text: 'Delete', backgroundColor: COLORS.red, onPress: () => onDelete(account) }] : []
    ]}
  >
    <View style={accountSection.container}>
      <TouchableOpacity style={accountSection.name} onPress={() => onSwitch(account)}>
        <View style={[accountSection.indicator, isActive && accountSection.indicatorActive]} />
        <FIcons name={isActive ? 'user-check' : 'user'} size={20} color={isActive ? COLORS.primary : COLORS.lightGrey4} />
        <Text style={isActive ? accountSection.nameTextActive : accountSection.nameText}>{account?.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={accountSection.actionBtn} onPress={() => onExport(account)}>
        <Icons name='key' size={20} color={COLORS.lightGrey3} />
      </TouchableOpacity>
    </View>
  </Swipeout>
);


const AccountSection = ({ navigation, defaultAccount, listAccount, setDefaultAccount, reloadAccountFollowingToken, getAccountBalance, removeAccount }) => {
  const onHandleSwitchAccount = onClickView(async account => {
    try {
      await setDefaultAccount(account);
      await getAccountBalance(account);
      await reloadAccountFollowingToken(account);
    } catch {
      console.warn('Switched account successfully, but can not load account details, please reload manually');
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
            } catch {
              Toast.showError('Something went wrong. Please try again.');
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
      icon: <MdIcons name="input" size={25} />,
      desc: 'Import an existing account',
      label: 'Import',
      handlePress: handleImport
    },
    {
      id: 'create',
      icon: <MdIcons name="add" size={25} />,
      desc: 'Create a new account',
      label: 'Create',
      handlePress: handleCreate
    }
  ];

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
                  listAccount.length > 1 ? handleDelete : null,
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
  setDefaultAccount: PropTypes.func.isRequired,
  reloadAccountFollowingToken: PropTypes.func.isRequired,
  getAccountBalance: PropTypes.func.isRequired,
  removeAccount: PropTypes.func.isRequired,
};

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
  listAccount: accountSeleclor.listAccount(state)
});

const mapDispatch = { setDefaultAccount, reloadAccountFollowingToken, getAccountBalance, removeAccount };

export default connect(mapState, mapDispatch)(AccountSection);