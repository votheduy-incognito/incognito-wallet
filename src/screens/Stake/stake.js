import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useSelector} from 'react-redux';
import sourceBackground from '@assets/images/icons/stake_background.png';
import PropTypes from 'prop-types';
import Tooltip from '@components/Tooltip/Tooltip';
import {BtnDefault} from '@src/components/Button';
import {styled, styledActions} from './stake.styled';
import withStake from './stake.enhance';
import {stakeDataSelector, stakeSelector} from './stake.selector';
import Header from './stake.header';
import StakePoolCommunity from './features/StakePoolCommunity';
import StakeBalance from './stake.balance';
import StakeGuide from './stake.guide';

const StakeActions = props => {
  const {handleStartStake, toggleGuideHomeStake} = props;
  const {staked} = useSelector(stakeDataSelector);
  const {guide} = useSelector(stakeSelector);
  if (!guide) {
    return (
      <View style={styledActions.container}>
        <View style={styledActions.wrapper}>
          <Tooltip
            content={<StakeGuide toggleGuideHomeStake={toggleGuideHomeStake} />}
            containerStyle={styledActions.tooltipContainer}
            triangleStyle={styledActions.tooltipTriangle}
          />
          <BtnDefault
            title={staked ? 'Stake more' : 'Stake now'}
            onPress={handleStartStake}
            btnStyle={styledActions.btnStake}
          />
        </View>
      </View>
    );
  }
  return (
    <BtnDefault
      title={staked ? 'Stake more' : 'Stake now'}
      onPress={handleStartStake}
      btnStyle={styled.btnStake}
    />
  );
};

const Stake = props => {
  const {fetchData} = props;
  const {isFetching, guide} = useSelector(stakeSelector);
  const {currentRewardRate} = useSelector(stakeDataSelector);
  return (
    <View style={styled.container}>
      <Header />
      <ImageBackground source={sourceBackground} style={styled.background} />
      <View style={styled.scrolview}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flexGrow: 1}}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={fetchData} />
          }
        >
          <View style={styled.wrapper}>
            <View style={styled.hook}>
              <Text style={styled.title}>Staking balance</Text>
              <StakeBalance />
              <View style={styled.interestRateContainer}>
                <Text style={[styled.desc, {color: '#FF8D01'}]}>
                  {`${currentRewardRate}%`}
                </Text>
                <Text style={styled.desc}>Annual Rate</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <StakeActions {...props} />
      <StakePoolCommunity />
    </View>
  );
};

StakeActions.propTypes = {
  handleStartStake: PropTypes.func.isRequired,
  toggleGuideHomeStake: PropTypes.func.isRequired,
};

Stake.propTypes = {
  fetchData: PropTypes.func.isRequired,
  handleStartStake: PropTypes.func.isRequired,
  toggleGuideHomeStake: PropTypes.func.isRequired,
};

export default withStake(Stake);
