import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {BtnDefault} from '@src/components/Button';
import {COLORS, FONT} from '@src/styles';
import {useNavigation} from 'react-navigation-hooks';
import {useDispatch} from 'react-redux';
import {actionToggleModal} from '@src/components/Modal';
import routeNames from '@src/router/routeNames';
import {BlockChecked} from '../ShowStatus';

const styled = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    padding: 20,
    width: '100%',
    zIndex: 100,
  },
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    textAlign: 'center',
    marginBottom: 40,
  },
});

const RecoverAccountSuccess = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handlePress = async () => {
    navigation.navigate(routeNames.Stake);
    await dispatch(actionToggleModal());
  };
  return (
    <View style={styled.wrapper}>
      <View style={styled.container}>
        <BlockChecked title="Import successfully" />
        <Text style={styled.desc}>
          Your pStake account has been imported successfully. Go to Staking to
          manage your investments.
        </Text>
        <BtnDefault title="OK" onPress={handlePress} />
      </View>
    </View>
  );
};

RecoverAccountSuccess.propTypes = {};

export default RecoverAccountSuccess;
