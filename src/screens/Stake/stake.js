import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Modal, {actionToggleModal} from '@src/components/Modal';
import {BtnDefault} from '@src/components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {ArrowUpIcon} from '@src/components/Icons';
import sourceBackground from '@assets/images/icons/stake_background.png';
import PropTypes from 'prop-types';
import format from '@src/utils/format';
import {styled} from './stake.styled';
import withStake from './stake.enhance';
import StakeModal from './stake.modal';
import {actionChangeFLowStep} from './stake.actions';
import {DEPOSIT_FLOW, STEP_FLOW} from './stake.constant';
import {stakeDataSelector, stakeSelector} from './stake.selector';
import {
  getTotalBalance,
  MAX_DIGITS_BALANCE_PSTAKE,
  TIMEOUT_CAL_REALTIME_BALANCE_PSTAKE,
} from './stake.utils';
import Header from './stake.header';
import StakePoolCommunity from './features/StakePoolCommunity';

const Stake = props => {
  const dispatch = useDispatch();
  const {fetchData} = props;
  const {isFetching} = useSelector(stakeSelector);
  const {
    balance,
    symbol,
    staked,
    currentRewardRate,
    rewardDateToMilSec,
    pDecimals,
    nodeTime,
    shouldCalInterestRate,
  } = useSelector(stakeDataSelector);
  const initialState = {
    balanceCurrent: 0,
    duration: 1,
    nextNodeTime: null,
  };
  const [state, setState] = React.useState(initialState);
  const {balanceCurrent, nextNodeTime} = state;
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
  const handleReCalBalance = async () => {
    try {
      if (!nextNodeTime) {
        return;
      }
      const totalBalance = getTotalBalance({
        nodeTime: nextNodeTime,
        balance,
        currentRewardRate,
        rewardDateToMilSec,
      });
      const totalBalanceFixed = format.balance(
        totalBalance,
        pDecimals,
        MAX_DIGITS_BALANCE_PSTAKE,
      );
      const nextNodeTimeCurrent =
        nextNodeTime + TIMEOUT_CAL_REALTIME_BALANCE_PSTAKE;
      await setState({
        ...state,
        balanceCurrent: totalBalanceFixed,
        nextNodeTime: nextNodeTimeCurrent,
      });
    } catch (error) {
      await setState({
        ...state,
        balanceCurrent: balance,
      });
    }
  };
  React.useEffect(() => {
    if (balance !== 0 && shouldCalInterestRate) {
      const intervalId = setInterval(
        handleReCalBalance,
        TIMEOUT_CAL_REALTIME_BALANCE_PSTAKE,
      );
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setState({
        ...state,
        balanceCurrent: format.balance(
          balance,
          pDecimals,
          MAX_DIGITS_BALANCE_PSTAKE,
        ),
      });
    }
  }, [balance, nextNodeTime]);
  React.useEffect(() => {
    setState({
      ...state,
      nextNodeTime: nodeTime,
    });
  }, [nodeTime]);
  return (
    <View style={styled.container}>
      <Header />
      <ImageBackground source={sourceBackground} style={styled.background} />
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
            <View style={styled.balanceContainer}>
              <Text style={styled.balance} numberOfLines={1}>
                {balanceCurrent === 0 ? '0.00' : balanceCurrent}
              </Text>
              <Text style={styled.symbol}>{symbol}</Text>
              {staked && (
                <View style={styled.arrow}>
                  <ArrowUpIcon />
                </View>
              )}
            </View>
            <View style={styled.interestRateContainer}>
              <Text style={[styled.desc, {color: '#FF8D01'}]}>
                {`${currentRewardRate}%`}
              </Text>
              <Text style={styled.desc}>Annual Rate</Text>
            </View>
          </View>
          <BtnDefault
            title={staked ? 'Stake more' : 'Stake'}
            btnStyle={styled.btnStake}
            onPress={handleStartStake}
          />
          <StakePoolCommunity />
        </View>
      </ScrollView>
      <Modal />
    </View>
  );
};

Stake.propTypes = {
  fetchData: PropTypes.func.isRequired,
};

export default withStake(Stake);
