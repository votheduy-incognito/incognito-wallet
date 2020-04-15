import {createSelector} from 'reselect';
import {STEP_FLOW, DEPOSIT_FLOW, WITHDRAW_FLOW} from './stake.constant';
import {isStakeAccount} from './stake.utils';

export const stakeSelector = createSelector(
  state => state.stake,
  stake => stake,
);

export const stakeDataSelector = createSelector(stakeSelector, stake => {
  const {data} = stake;
  const {balance} = data;
  const staked = balance !== 0;
  return {
    ...data,
    staked,
  };
});

export const flowStakeSelector = createSelector(
  stakeSelector,
  stake => stake.flow,
);

export const pStakeAccountSelector = createSelector(
  state => state?.account?.list || [],
  list =>
    list.length > 0 ? list.find(account => isStakeAccount(account)) : null,
);

export const createStakeSelector = createSelector(
  stakeSelector,
  stake => stake.createStake,
);

export const createUnStakeSelector = createSelector(
  stakeSelector,
  state => state.createUnStake,
);

export const feeStakeSelector = createSelector(
  stakeSelector,
  stake => stake.fee,
);

export const activeFlowSelector = createSelector(
  flowStakeSelector,
  stakeDataSelector,
  pStakeAccountSelector,
  state => state.wallet,
  feeStakeSelector,
  createStakeSelector,
  (flow, data, pStakeAccount, wallet, fee, createStake) => {
    const {activeFlow} = flow;
    const activedFlowData = flow[activeFlow];
    const {step, account} = activedFlowData;
    const {stakingMasterAddress} = data;
    let hook = {
      headerTitle: '',
      btnSubmitAmount: '',
      btnSubmitStatus: '',
      titleStatus: '',
      warningStatus: '',
      from: '',
      to: '',
      walletAccount: null,
    };
    switch (activeFlow) {
    case DEPOSIT_FLOW:
      hook.btnSubmitAmount = fee.isFetching ? 'Estimate fee...' : 'Deposit';
      hook.btnSubmitStatus = createStake.backup
        ? 'OK'
        : 'Back up your account';
      hook.titleStatus = 'Deposit is in progress';
      hook.warningStatus = createStake.backup
        ? ''
        : 'Back up your staking account to keep your assets safe.';
      break;
    case WITHDRAW_FLOW:
      hook.btnSubmitAmount = 'Withdraw';
      hook.btnSubmitStatus = 'Continue';
      hook.titleStatus = 'Withdrawal is in progress';
      break;
    default:
      break;
    }
    switch (step) {
    case STEP_FLOW.CHOOSE_ACCOUNT:
    case STEP_FLOW.SHOW_STATUS: {
      if (activeFlow === DEPOSIT_FLOW) {
        hook = {
          ...hook,
          headerTitle: 'Deposit from',
        };
      }
      if (activeFlow === WITHDRAW_FLOW) {
        hook = {
          ...hook,
          headerTitle: 'Withdraw to',
        };
      }
      break;
    }
    case STEP_FLOW.TYPE_AMOUNT: {
      if (activeFlow === DEPOSIT_FLOW) {
        hook = {
          ...hook,
          headerTitle: 'Amount',
          from: account?.PaymentAddress,
          to: stakingMasterAddress,
          walletAccount: wallet.getAccountByName(
              account?.name || account?.AccountName,
          ),
        };
      }
      if (activeFlow === WITHDRAW_FLOW) {
        hook = {
          ...hook,
          headerTitle: 'Amount',
          from: pStakeAccount?.PaymentAddress,
          to: account?.PaymentAddress,
          walletAccount: wallet.getAccountByName(
              pStakeAccount?.name || pStakeAccount?.AccountName,
          ),
        };
      }
      break;
    }
    default:
      break;
    }
    return {
      ...activedFlowData,
      activeFlow,
      ...hook,
    };
  },
);

export const loadingSubmitAmountSelector = createSelector(
  activeFlowSelector,
  createStakeSelector,
  createUnStakeSelector,
  (activedFlow, createStake, createUnStake) => {
    const {activeFlow} = activedFlow;
    switch (activeFlow) {
    case DEPOSIT_FLOW: {
      return createStake.isFetching;
    }
    case WITHDRAW_FLOW: {
      return createUnStake.isFetching;
    }
    default:
      break;
    }
  },
);
