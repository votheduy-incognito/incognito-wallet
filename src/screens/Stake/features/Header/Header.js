import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {activeFlowSelector} from '@screens/Stake/stake.selector';
import {useSelector, useDispatch} from 'react-redux';
import BackButton from '@src/components/BackButton';
import {STEP_FLOW} from '@screens/Stake/stake.constant';
import {actionToggleModal} from '@src/components/Modal';
import {FONT, COLORS, THEME} from '@src/styles';
import {BtnClose} from '@src/components/Button';
import {actionChangeFLowStep} from '../../stake.actions';

const styled = StyleSheet.create({
  container: {
    backgroundColor: THEME.header.backgroundColor,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.white,
  },
  btnClose: {
    marginRight: 20,
  },
});

const Header = () => {
  const dispatch = useDispatch();
  const {step, headerTitle, activeFlow} = useSelector(activeFlowSelector);

  const handleToggleModal = async () => await dispatch(actionToggleModal());

  const handleBack = async () => {
    switch (step) {
    case STEP_FLOW.TYPE_AMOUNT: {
      return await dispatch(
        actionChangeFLowStep({
          activeFlow,
          step: STEP_FLOW.CHOOSE_ACCOUNT,
        }),
      );
    }
    default:
      await handleToggleModal();
    }
  };
  if (step === STEP_FLOW.SHOW_STATUS) {
    return null;
  }
  return (
    <View style={styled.container}>
      <BackButton onPress={handleBack} />
      <Text style={styled.title}>{headerTitle}</Text>
      <View style={styled.btnClose}>
        <BtnClose onPress={handleToggleModal} />
      </View>
    </View>
  );
};

Header.propTypes = {};

export default Header;
