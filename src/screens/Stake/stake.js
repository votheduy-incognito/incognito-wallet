import React from 'react';
import {Text, View, ImageBackground} from 'react-native';
import Modal, {actionToggleModal} from '@src/components/Modal';
import {BtnDefault} from '@src/components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {ArrowUpIcon} from '@src/components/Icons';
import {getDecimalSeparator} from '@src/resources/separator';
import sourceBackground from '@assets/images/icons/stake_background.png';
import {styled} from './stake.styled';
import withStake from './stake.enhance';
import StakeModal from './stake.modal';
import {actionChangeFLowStep} from './stake.actions';
import {DEPOSIT_FLOW, STEP_FLOW} from './stake.constant';
import {stakeDataSelector} from './stake.selector';
import {calInterestRate} from './stake.utils';
import Header from './stake.header';
import StakePoolCommunity from './features/StakePoolCommunity';

const Stake = () => {
  const dispatch = useDispatch();
  const {balance, symbol, staked, currentRewardRate, rewardDate} = useSelector(
    stakeDataSelector,
  );
  const initialState = {
    balanceCurrent: 0,
    duration: 1,
  };
  const [state, setState] = React.useState(initialState);
  const {balanceCurrent} = state;
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
      const interestRate = calInterestRate(
        balance,
        currentRewardRate,
        rewardDate,
      );
      const totalBalance = ((balance + interestRate) / 1e9)
        .toFixed(6)
        .replace('.', getDecimalSeparator());
      if (!isNaN(totalBalance)) {
        await setState({
          ...state,
          balanceCurrent: totalBalance,
        });
      }
    } catch (error) {
      await setState({
        ...state,
        balanceCurrent: balance,
      });
    }
  };
  React.useEffect(() => {
    if (balance !== 0) {
      const intervalId = setInterval(handleReCalBalance, 100);
      return () => {
        clearInterval(intervalId);
      };
    } else {
      setState({
        ...state,
        balanceCurrent: 0,
      });
    }
  }, [balance]);
  return (
    <View style={styled.container}>
      <Header />
      <ImageBackground source={sourceBackground} style={styled.background} />
      <View style={styled.wrapper}>
        <View style={styled.hook}>
          <Text style={styled.title}>Staking balance</Text>
          <View style={styled.balanceContainer}>
            <Text
              style={styled.balance}
              numberOfLine={1}
              ellipsizeMode="middle"
            >
              {balanceCurrent}
            </Text>
            <Text style={styled.symbol}>{symbol}</Text>
            {staked && (
              <View style={styled.arrow}>
                <ArrowUpIcon />
              </View>
            )}
          </View>
          <Text style={styled.desc}>
            Current rate:
            <Text style={[styled.desc, {color: '#FF8D01'}]}>
              {` ${currentRewardRate}% APR`}
            </Text>
          </Text>
        </View>
        <BtnDefault
          title={staked ? 'Add more funds' : 'Add funds to stake'}
          btnStyle={styled.btnStake}
          onPress={handleStartStake}
        />
        <StakePoolCommunity />
      </View>
      <Modal shouldCloseModalWhenTapOverlay={false} />
    </View>
  );
};

Stake.propTypes = {};

export default withStake(Stake);
