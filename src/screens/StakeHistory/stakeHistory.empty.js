import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {EmptyActivitiesIcon} from '@src/components/Icons';
import {BtnDefault} from '@src/components/Button';
import {useDispatch} from 'react-redux';
import {actionToggleModal} from '@src/components/Modal';
import StakeModal from '@screens/Stake/stake.modal';
import {actionChangeFLowStep} from '@screens/Stake/stake.actions';
import {DEPOSIT_FLOW, STEP_FLOW} from '@screens/Stake/stake.constant';

const styled = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    marginVertical: 12,
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
    marginBottom: 30,
  },
});

const Empty = () => {
  const dispatch = useDispatch();
  const handleStartStake = async () => {
    await new Promise.all([
      dispatch(
        actionToggleModal({
          data: <StakeModal />,
          visible: true,
        }),
      ),
      dispatch(
        actionChangeFLowStep({
          activeFlow: DEPOSIT_FLOW,
          step: STEP_FLOW.CHOOSE_ACCOUNT,
        }),
      ),
    ]);
  };
  return (
    <View style={styled.container}>
      <EmptyActivitiesIcon />
      <Text style={styled.title}>No activities</Text>
      <Text style={styled.desc}>
        When you add or withdraw funds,{'\n'}
        activities will show up here.
      </Text>
      <BtnDefault onPress={handleStartStake} title="Add funds to stake" />
    </View>
  );
};

Empty.propTypes = {};

export default Empty;
