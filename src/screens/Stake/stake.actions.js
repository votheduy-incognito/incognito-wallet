import {
  getEstimateFeeForNativeToken,
  getNodeTime,
} from '@src/services/wallet/RpcClientService';
import convert from '@src/utils/convert';
import {getSignPublicKey, signPoolWithdraw} from '@src/services/gomobile';
import {actionSendNativeToken} from '@src/redux/actions/account';
import {CONSTANT_COMMONS} from '@src/constants';
import {
  actionUpdateStorageHistory,
  actionRemoveStorageHistory,
} from '@src/screens/StakeHistory/stakeHistory.actions';
import {v4} from 'uuid';
import {actionToggleLoadingModal} from '@src/components/Modal';
import {
  ACTION_FETCHING,
  ACTION_FETCHED,
  ACTION_FETCH_FAIL,
  ACTION_CHANGE_FLOW_STEP,
  ACTION_CHANGE_FLOW_ACCOUNT,
  ACTION_CHANGE_FLOW_AMOUNT,
  ACTION_FETCHING_FEE,
  ACTION_FETCHED_FEE,
  ACTION_FETCH_FAIL_FEE,
  ACTION_FETCHING_CREATE_STAKE,
  ACTION_FETCHED_CREATE_STAKE,
  ACTION_FETCH_FAIL_CREATE_STAKE,
  ACTION_FETCHING_CREATE_UNSTAKE,
  ACTION_FETCHED_CREATE_UNSTAKE,
  ACTION_FETCH_FAIL_CREATE_UNSTAKE,
  ACTION_BACKUP_CREATE_STAKE,
  ACTION_FETCHING_CREATE_UNSTAKE_REWARDS,
  ACTION_FETCH_FAIL_CREATE_UNSTAKE_REWARDS,
  ACTION_FETCHED_CREATE_UNSTAKE_REWARDS,
  ACTION_TOGGLE_GUIDE,
} from './stake.constant';
import {
  apiGetMasterAddress,
  apiGetStakerInfo,
  apiCreateStake,
  apiUnStake,
  apiUnStakeRewards,
} from './stake.services';
import {
  stakeSelector,
  pStakeAccountSelector,
  stakeDataSelector,
  activeFlowSelector,
  createUnStakeSelector,
  createStakeSelector,
  feeStakeSelector,
} from './stake.selector';
import {mappingData, ERROR_MESSAGE} from './stake.utils';

export const actionFetching = () => ({
  type: ACTION_FETCHING,
});

export const actionFetched = payload => ({
  type: ACTION_FETCHED,
  payload,
});

export const actionFetchFail = () => ({
  type: ACTION_FETCH_FAIL,
});

export const actionFetch = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const pStakeAccount = pStakeAccountSelector(state);
    const {isFetching} = stakeSelector(state);
    if (!pStakeAccount) {
      throw 'pStake account can\'t not found!';
    }
    if (isFetching) {
      return;
    }
    await dispatch(actionFetching());
    const [
      dataMasterAddress,
      dataStakerInfo,
      nodeTimeCurrent,
    ] = await new Promise.all([
      await apiGetMasterAddress(),
      await apiGetStakerInfo({paymentAddress: pStakeAccount?.PaymentAddress}),
      await getNodeTime(),
    ]);
    const payload = mappingData(dataMasterAddress, dataStakerInfo);
    await dispatch(
      actionFetched({
        ...payload,
        nodeTime: nodeTimeCurrent * 1000,
        localTime: new Date().getTime(),
      }),
    );
  } catch (error) {
    await dispatch(actionFetchFail());
    throw error;
  }
};

export const actionChangeFLowStep = (
  payload = {activeFlow: 'deposit', step: 0},
) => ({
  type: ACTION_CHANGE_FLOW_STEP,
  payload,
});

export const actionChangeFlowAccount = (
  payload = {account: null, balancePStake: 0},
) => ({
  type: ACTION_CHANGE_FLOW_ACCOUNT,
  payload,
});

export const actionChangeFlowAmount = (payload = {amount: 0}) => ({
  type: ACTION_CHANGE_FLOW_AMOUNT,
  payload,
});

export const actionFetchingFee = () => ({
  type: ACTION_FETCHING_FEE,
});

export const actionFetchedFee = payload => ({
  type: ACTION_FETCHED_FEE,
  payload,
});

export const actionFetchFailFee = () => ({
  type: ACTION_FETCH_FAIL_FEE,
});

export const actionFetchFee = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const {from, to, walletAccount} = activeFlowSelector(state);
    const {pDecimals, maxToStake} = stakeDataSelector(state);
    const {isFetching} = feeStakeSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetchingFee());
    const amountConverted = convert.toOriginalAmount(
      convert.toHumanAmount(maxToStake, pDecimals),
      pDecimals,
    );
    const feeEst = await getEstimateFeeForNativeToken(
      from,
      to,
      amountConverted,
      walletAccount,
    );
    await dispatch(actionFetchedFee(feeEst));
  } catch (error) {
    await dispatch(actionFetchFailFee());
    throw error;
  }
};

export const actionBackupCreateStake = () => ({
  type: ACTION_BACKUP_CREATE_STAKE,
});

export const actionFetchingCreateStake = () => ({
  type: ACTION_FETCHING_CREATE_STAKE,
});

export const actionFetchedCreateStake = payload => ({
  type: ACTION_FETCHED_CREATE_STAKE,
  payload,
});

export const actionFetchFailCreateStake = () => ({
  type: ACTION_FETCH_FAIL_CREATE_STAKE,
});

export const actionFetchCreateStake = ({amount, fee}) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const {isFetching} = createStakeSelector(state);
  if (isFetching) {
    return;
  }
  const pStakeAccount = pStakeAccountSelector(state);
  const {account} = activeFlowSelector(state);
  const {stakingMasterAddress} = stakeDataSelector(state);
  const stakeHistoryItem = {
    ID: v4(),
    Amount: convert.toOriginalAmount(
      convert.toNumber(amount),
      CONSTANT_COMMONS.PRV.pDecimals,
    ),
    Type: 1,
    Status: 0,
    IncognitoTx: null,
    MasterAddress: stakingMasterAddress,
    PaymentAddress: pStakeAccount?.PaymentAddress,
    CreatedAt: new Date().getTime(),
  };
  try {
    await dispatch(actionFetchingCreateStake());
    const [tx, signPublicKeyEncode] = await new Promise.all([
      await dispatch(
        actionSendNativeToken({
          account,
          amount,
          fee,
          toAddress: stakingMasterAddress,
          pDecimals: CONSTANT_COMMONS.PRV.pDecimals,
        }),
      ),
      await getSignPublicKey(pStakeAccount?.PrivateKey),
    ]);
    if (!tx?.txId) {
      throw ERROR_MESSAGE.txId;
    } else {
      stakeHistoryItem.IncognitoTx = tx?.txId;
    }
    if (!signPublicKeyEncode) {
      throw ERROR_MESSAGE.signPublicKeyEncode;
    }
    const payload = await apiCreateStake({
      PStakeAddress: pStakeAccount?.PaymentAddress,
      SignPublicKeyEncode: signPublicKeyEncode,
      IncognitoTx: tx?.txId,
    });
    if (payload?.ID) {
      await dispatch(actionToggleLoadingModal());
      return await new Promise.all([
        await dispatch(actionFetchedCreateStake(payload)),
        await dispatch(
          actionChangeFlowAmount({amount: payload?.Amount || amount}),
        ),
        await dispatch(actionFetch()),
      ]);
    } else {
      throw ERROR_MESSAGE.createStake;
    }
  } catch (error) {
    await dispatch(actionFetchFailCreateStake());
    if (stakeHistoryItem.IncognitoTx) {
      await dispatch(
        actionUpdateStorageHistory({
          ...stakeHistoryItem,
          Status: 3,
          RetryDeposit: true,
        }),
      );
    }
    throw error;
  }
};

export const actionRetryCreateState = ({txId, id}) => async (
  dispatch,
  getState,
) => {
  const state = getState();
  const {isFetching} = createStakeSelector(state);
  if (isFetching) {
    return;
  }
  try {
    await dispatch(actionFetchingCreateStake());
    const pStakeAccount = pStakeAccountSelector(state);
    const signPublicKeyEncode = await getSignPublicKey(
      pStakeAccount?.PrivateKey,
    );
    if (!txId) {
      throw ERROR_MESSAGE.txId;
    }
    if (!signPublicKeyEncode) {
      throw ERROR_MESSAGE.signPublicKeyEncode;
    }
    const payload = await apiCreateStake({
      PStakeAddress: pStakeAccount?.PaymentAddress,
      SignPublicKeyEncode: signPublicKeyEncode,
      IncognitoTx: txId,
    });
    if (payload?.ID) {
      return await new Promise.all([
        await dispatch(actionFetchedCreateStake(payload)),
        await dispatch(actionFetch()),
        await dispatch(actionRemoveStorageHistory(id)),
      ]);
    } else {
      throw ERROR_MESSAGE.createStake;
    }
  } catch (error) {
    await dispatch(actionFetchFailCreateStake());
    throw error;
  }
};

export const actionFetchingCreateUnStake = () => ({
  type: ACTION_FETCHING_CREATE_UNSTAKE,
});

export const actionFetchedCreateUnStake = payload => ({
  type: ACTION_FETCHED_CREATE_UNSTAKE,
  payload,
});

export const actionFetchFailCreateUnStake = () => ({
  type: ACTION_FETCH_FAIL_CREATE_UNSTAKE,
});

export const actionFetchCreateUnStake = ({amount}) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const {isFetching} = createUnStakeSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetchingCreateUnStake());
    const pStakeAccount = pStakeAccountSelector(state);
    const {account} = activeFlowSelector(state);
    const originalAmount = convert.toOriginalAmount(
      convert.toNumber(amount),
      CONSTANT_COMMONS.PRV.pDecimals,
    );
    const signEncode = await signPoolWithdraw(
      pStakeAccount?.PrivateKey,
      account?.PaymentAddress,
      originalAmount,
    );
    if (!signEncode) {
      throw ERROR_MESSAGE.signEncode;
    }
    const data = {
      PStakeAddress: pStakeAccount?.PaymentAddress,
      PaymentAddress: account?.PaymentAddress,
      Amount: originalAmount,
      SignEncode: signEncode,
    };
    const payload = await apiUnStake(data);
    if (payload?.ID) {
      await dispatch(actionToggleLoadingModal());
      return await new Promise.all([
        await dispatch(actionFetchedCreateUnStake(payload)),
        await dispatch(
          actionChangeFlowAmount({amount: payload?.Amount || amount}),
        ),
        await dispatch(actionFetch()),
      ]);
    } else {
      throw ERROR_MESSAGE.createUnStake;
    }
  } catch (error) {
    await dispatch(actionFetchFailCreateUnStake());
    throw error;
  }
};

export const actionFetchingCreateUnStakeRewards = () => ({
  type: ACTION_FETCHING_CREATE_UNSTAKE_REWARDS,
});

export const actionFetchedCreateUnStakeRewards = payload => ({
  type: ACTION_FETCHED_CREATE_UNSTAKE_REWARDS,
  payload,
});

export const actionFetchFailCreateUnStakeRewards = () => ({
  type: ACTION_FETCH_FAIL_CREATE_UNSTAKE_REWARDS,
});

export const actionFetchCreateUnStakeRewards = ({amount}) => async (
  dispatch,
  getState,
) => {
  try {
    const state = getState();
    const {isFetching} = createUnStakeSelector(state);
    if (isFetching) {
      return;
    }
    await dispatch(actionFetchingCreateUnStakeRewards());
    const pStakeAccount = pStakeAccountSelector(state);
    const {account} = activeFlowSelector(state);
    const originalAmount = convert.toOriginalAmount(
      convert.toNumber(amount),
      CONSTANT_COMMONS.PRV.pDecimals,
    );
    const signEncode = await signPoolWithdraw(
      pStakeAccount?.PrivateKey,
      account?.PaymentAddress,
      originalAmount,
    );
    const data = {
      PStakeAddress: pStakeAccount?.PaymentAddress,
      PaymentAddress: account?.PaymentAddress,
      Amount: originalAmount,
      SignEncode: signEncode,
    };
    const payload = await apiUnStakeRewards(data);
    if (payload?.ID) {
      return await new Promise.all([
        await dispatch(actionFetchedCreateUnStakeRewards(payload)),
        await dispatch(
          actionChangeFlowAmount({amount: payload?.Amount || amount}),
        ),
        await dispatch(actionFetch()),
      ]);
    }
  } catch (error) {
    await dispatch(actionFetchFailCreateUnStakeRewards());
    throw error;
  }
};

export const actionToggleGuide = () => ({
  type: ACTION_TOGGLE_GUIDE,
});
