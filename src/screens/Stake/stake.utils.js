import {CONSTANT_COMMONS} from '@src/constants';
import {ExHandler} from '@src/services/exception';
import {getNodeTime} from '@src/services/wallet/RpcClientService';
import format from '@src/utils/format';

export const STAKE = {
  MAIN_ACCOUNT: 'pStake',
};

export const isStakeAccount = account => {
  if (!account) {
    return false;
  }
  return (
    account?.AccountName === STAKE.MAIN_ACCOUNT ||
    account?.name === STAKE.MAIN_ACCOUNT
  );
};

export const mappingData = (dataMasterAddress, dataStakerInfo) => {
  const {pDecimals, symbol} = CONSTANT_COMMONS.PRV;
  return {
    minToStake: dataMasterAddress?.MinToStake || 0,
    minToWithdraw: 1,
    currentRewardRate: dataMasterAddress?.CurrentRewardRate || 50,
    stakingMasterAddress: dataMasterAddress?.StakingMasterAddress || '',
    balance: dataStakerInfo?.Balance + dataStakerInfo?.RewardBalance || 0,
    rewardDate: dataStakerInfo?.RewardDate || '',
    pDecimals,
    symbol,
    maxToStake: 0,
    rewardDateToMilSec: new Date(dataStakerInfo?.RewardDate).getTime(),
  };
};

export const calInterestRate = (
  nowToMilSec,
  balance = 0,
  rate = 50,
  rewardDateToMilSec,
) => {
  try {
    const duration = nowToMilSec - rewardDateToMilSec;
    if (duration < 0) {
      return 0;
    }
    const interestRate =
      (balance * (rate / 100) * duration) / (365 * 24 * 60 * 60 * 1000);
    if (!isNaN(Number(interestRate))) {
      return interestRate;
    }
    return 0;
  } catch (error) {
    new ExHandler(error).showErrorToast();
    return 0;
  }
};

export const getTotalBalance = ({
  nodeTime,
  balance,
  currentRewardRate,
  rewardDateToMilSec,
}) => {
  const interestRate = calInterestRate(
    nodeTime,
    balance,
    currentRewardRate,
    rewardDateToMilSec,
  );
  return balance + interestRate;
};
