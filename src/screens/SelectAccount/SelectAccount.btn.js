import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { accountSeleclor } from '@src/redux/selectors';
import { COLORS, FONT } from '@src/styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.colorGrey,
    padding: 10,
    flexDirection: 'row',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginRight: 10,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
    maxWidth: 100,
  },
});

const BtnSelectAccount = () => {
  const account = useSelector(accountSeleclor.defaultAccountSelector);
  const navigation = useNavigation();
  const onNavSelectAccount = () =>
    navigation.navigate(routeNames.SelectAccount);
  return (
    <TouchableWithoutFeedback onPress={onNavSelectAccount}>
      <View style={styled.container}>
        <Text numberOfLines={1} style={styled.name}>
          {account?.accountName}
        </Text>
        <Ionicons name="ios-arrow-down" color={COLORS.black} size={20} />
      </View>
    </TouchableWithoutFeedback>
  );
};

BtnSelectAccount.propTypes = {};

export default BtnSelectAccount;
