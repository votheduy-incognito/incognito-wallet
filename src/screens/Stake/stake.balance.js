import React from 'react';
import {View, Text} from 'react-native';
import {ArrowUpIcon} from '@src/components/Icons';
import format from '@src/utils/format';
import {useSelector} from 'react-redux';
import {
  MAX_DIGITS_BALANCE_PSTAKE,
  TIMEOUT_CAL_REALTIME_BALANCE_PSTAKE,
  calInterestRate,
} from './stake.utils';
import {stakeDataSelector} from './stake.selector';
import {styled} from './stake.styled';

const StakeBalance = () => {
  const initialState = {
    balanceCurrent: 0,
    duration: 1,
    nextNodeTime: null,
  };
  const [state, setState] = React.useState(initialState);
  const {balanceCurrent, nextNodeTime} = state;
  const {
    balance,
    symbol,
    staked,
    currentRewardRate,
    rewardDateToMilSec,
    pDecimals,
    nodeTime,
    shouldCalInterestRate,
    totalBalance,
  } = useSelector(stakeDataSelector);
  const handleReCalBalance = async () => {
    try {
      if (!nextNodeTime) {
        return;
      }
      const interestRate = calInterestRate({
        nowToMilSec: nextNodeTime,
        balance,
        rate: currentRewardRate,
        rewardDateToMilSec,
      });
      const totalBalanceCurrent = format.balance(
        totalBalance + interestRate,
        pDecimals,
        MAX_DIGITS_BALANCE_PSTAKE,
      );
      const nextNodeTimeCurrent =
        nextNodeTime + TIMEOUT_CAL_REALTIME_BALANCE_PSTAKE;
      await setState({
        ...state,
        balanceCurrent: totalBalanceCurrent,
        nextNodeTime: nextNodeTimeCurrent,
      });
    } catch (error) {
      await setState({
        ...state,
        balanceCurrent: totalBalance,
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
          totalBalance,
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
  );
};

StakeBalance.propTypes = {};

export default StakeBalance;
