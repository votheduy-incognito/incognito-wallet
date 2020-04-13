import {CONSTANT_COMMONS} from '@src/constants';
import {ExHandler} from '@src/services/exception';

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
    minToWithdraw: dataMasterAddress?.MinToWithdraw || 0,
    currentRewardRate: dataMasterAddress?.CurrentRewardRate || 50,
    stakingMasterAddress: dataMasterAddress?.StakingMasterAddress || '',
    balance: dataStakerInfo?.Balance || 0,
    rewardDate: new Date(dataStakerInfo?.RewardDate).getTime(),
    pDecimals,
    symbol,
    maxToStake: 0,
  };
};

export const calInterestRate = (balance = 0, rate = 50, rewardDate) => {
  try {
    const nowToMilSec = new Date().getTime();
    const rewardDateToMilSec = new Date(rewardDate).getTime();
    const duration = nowToMilSec - rewardDateToMilSec;
    if (duration < 0) {
      return 0;
    }
    const interestRate =
      (balance * (rate / 100) * duration) / (365 * 24 * 60 * 60 * 1000);
    if (!isNaN(interestRate)) {
      return interestRate;
    }
    return 0;
  } catch (error) {
    new ExHandler(error).showErrorToast();
    return 0;
  }
};
