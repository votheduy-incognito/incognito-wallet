import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, Divider } from '@src/components/core';
import { accountSeleclor } from '@src/redux/selectors';
import Icons from 'react-native-vector-icons/Entypo';
import FIcons from 'react-native-vector-icons/Feather';
import ROUTE_NAMES from '@src/router/routeNames';
import { setDefaultAccount, reloadAccountFollowingToken } from '@src/redux/actions/account';
import { COLORS } from '@src/styles';
import Section from './Section';
import { accountSection } from './style';

const createItem = (account, onSwitch, onExport, isActive) => (
  <View style={accountSection.container}>
    <TouchableOpacity style={accountSection.name} onPress={() => onSwitch(account)}>
      <FIcons name={isActive ? 'user-check' : 'user'} size={20} color={isActive ? COLORS.primary : COLORS.lightGrey4} />
      <Text style={accountSection.nameText}>{account?.name}</Text>
    </TouchableOpacity>
    <TouchableOpacity style={accountSection.actionBtn} onPress={onExport}>
      <Icons name='key' size={20} color={COLORS.lightGrey3} />
    </TouchableOpacity>
  </View>
);


const AccountSection = ({ navigation, defaultAccount, listAccount, setDefaultAccount, reloadAccountFollowingToken }) => {
  const onHandleSwitchAccount = account => {

    setDefaultAccount(account);
    reloadAccountFollowingToken(account);
  };

  const handleExportKey = () => {
    navigation.navigate(ROUTE_NAMES.ExportAccount);
  };

  return (
    <Section
      label='Your accounts'
      customItems={
        listAccount?.map((account, index) => (
          <View key={account?.name} style={accountSection.itemWrapper}>
            {createItem(account, onHandleSwitchAccount, handleExportKey, account?.name === defaultAccount?.name)}
            { (index < listAccount.length - 1) && <Divider height={1} color={COLORS.lightGrey3} /> }
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
};

const mapState = state => ({
  defaultAccount: accountSeleclor.defaultAccount(state),
  listAccount: accountSeleclor.listAccount(state)
});

const mapDispatch = { setDefaultAccount, reloadAccountFollowingToken };

export default connect(mapState, mapDispatch)(AccountSection);