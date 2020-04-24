import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {activeFlowSelector} from '@screens/Stake/stake.selector';
import {useSelector, useDispatch} from 'react-redux';
import {STEP_FLOW} from '@screens/Stake/stake.constant';
import {actionToggleModal} from '@src/components/Modal';
import {FONT, COLORS, THEME} from '@src/styles';
import {BtnClose, BtnBack} from '@src/components/Button';
import {actionChangeFLowStep} from '../../stake.actions';

const styled = StyleSheet.create({
  container: {
    backgroundColor: THEME.header.backgroundColor,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.white,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnClose: {
    marginLeft: 'auto',
  },
  btnBack: {
    zIndex: 1,
    position: 'relative',
  },
});

const Header = () => {
  const dispatch = useDispatch();
  const {step, headerTitle, activeFlow} = useSelector(activeFlowSelector);
  const shouldHideBackBtn = STEP_FLOW.CHOOSE_ACCOUNT === step;
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
      {!shouldHideBackBtn && (
        <View style={styled.btnBack}>
          <BtnBack onPress={handleBack} />
        </View>
      )}
      <View style={styled.titleContainer}>
        <Text style={styled.title}>{headerTitle}</Text>
      </View>
      <View style={styled.btnClose}>
        <BtnClose colorIcon={COLORS.white} onPress={handleToggleModal} />
      </View>
    </View>
  );
};

Header.propTypes = {};

export default Header;
