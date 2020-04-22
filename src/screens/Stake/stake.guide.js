import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS, FONT} from '@src/styles';
import {useSelector} from 'react-redux';
import {BtnClose} from '@src/components/Button';
import {ArrowRightPrimaryIcon} from '@src/components/Icons';
import {useNavigation} from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import PropTypes from 'prop-types';
import {stakeDataSelector} from './stake.selector';

const styled = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.medium,
    lineHeight: FONT.SIZE.medium + 6,
    color: COLORS.black,
    textAlign: 'center',
  },
  desc: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.lightGrey1,
    textAlign: 'center',
  },
  btnClose: {
    alignItems: 'flex-start',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noPRV: {
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.black,
    marginRight: 10,
  },
  getSome: {
    fontFamily: FONT.NAME.regular,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    color: COLORS.primary,
    marginRight: 10,
  },
  getSomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 7,
    height: 12,
  },
  main: {
    marginVertical: 20,
  },
});

const StakeGuide = props => {
  const navigation = useNavigation();
  const {currentRewardRate} = useSelector(stakeDataSelector);
  const {toggleGuideHomeStake} = props;
  const handleBuyPRV = async () => {
    navigation.navigate(routeNames.Dex);
    await toggleGuideHomeStake();
  };
  return (
    <View style={styled.wrapper}>
      <View style={styled.btnClose}>
        <BtnClose
          onPress={toggleGuideHomeStake}
          colorIcon={COLORS.lightGrey1}
          size={26}
        />
      </View>
      <Text style={styled.title}>Got PRV?</Text>
      <Text style={styled.desc}>
        Get a
        <Text style={[styled.desc, {color: '#FF8D01'}]}>
          {` ${currentRewardRate}% `}
        </Text>
        annual return.
      </Text>
      <View style={styled.main}>
        <Text style={styled.desc}>
          Join a staking pool and earn interest in every second.
        </Text>
        <Text style={styled.desc}>Get staking in just minutes.</Text>
        <Text style={styled.desc}>Withdraw anytime.</Text>
      </View>
      <View style={styled.bottom}>
        <Text style={styled.noPRV}>No PRV?</Text>
        <TouchableOpacity onPress={handleBuyPRV}>
          <View style={styled.getSomeContainer}>
            <Text style={styled.getSome}>Get some</Text>
            <ArrowRightPrimaryIcon style={styled.icon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

StakeGuide.propTypes = {
  toggleGuideHomeStake: PropTypes.func.isRequired,
};

export default StakeGuide;
